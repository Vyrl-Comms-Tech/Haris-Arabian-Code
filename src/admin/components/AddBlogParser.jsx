import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../styles/AddBlogParser.css'

const AddBlogParser = () => {
  const [content, setContent] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [isDragActive, setIsDragActive] = useState(false);
  const [stats, setStats] = useState({ wordCount: 0, headingCount: 0, paragraphCount: 0, bulletCount: 0 });
  const fileInputRef = useRef(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const generateId = () => {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const parseContentLine = (line) => {
    if (line.includes('(Bullet)')) {
      const content = line.replace('(Bullet)', '').trim();
      const cleanContent = content.replace(/^[●•\-]\s*/, '');
      return {
        type: 'bullet_point',
        content: cleanContent,
        formatting: 'bullet'
      };
    } else if (line.includes('(P)')) {
      return {
        type: 'paragraph',
        content: line.replace('(P)', '').trim(),
        formatting: 'paragraph'
      };
    } else if (line.includes('(p)')) {
      return {
        type: 'paragraph',
        content: line.replace('(p)', '').trim(),
        formatting: 'paragraph'
      };
    } else if (line.match(/^\d+\./)) {
      return {
        type: 'numbered_item',
        content: line.replace(/^\d+\.\s*/, ''),
        formatting: 'numbered'
      };
    } else if (line.startsWith('●') || line.startsWith('•') || line.startsWith('-')) {
      return {
        type: 'bullet_point',
        content: line.substring(1).trim(),
        formatting: 'bullet'
      };
    } else {
      return {
        type: 'paragraph',
        content: line,
        formatting: 'paragraph'
      };
    }
  };

  const parseGoogleDocContent = (content) => {
    const lines = content.split('\n').filter(line => line.trim());
    
    const blogData = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        title: '',
        description: '',
        author: '',
        tags: [],
        category: '',
        slug: ''
      },
      content: {
        title: '',
        sections: [],
        wordCount: 0,
        readingTime: 0
      },
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: []
      },
      status: 'draft'
    };

    let currentSection = null;
    let contentStarted = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Parse metadata
      if (line.toLowerCase().startsWith('meta title:')) {
        blogData.seo.metaTitle = line.substring(11).trim();
        continue;
      }
      
      if (line.toLowerCase().startsWith('meta description:')) {
        blogData.seo.metaDescription = line.substring(17).trim();
        continue;
      }

      if (line.toLowerCase().startsWith('[author:') && line.endsWith(']')) {
        blogData.metadata.author = line.slice(8, -1).trim();
        continue;
      }

      // Parse headings
      if (line.includes('(H1)')) {
        blogData.content.title = line.replace('(H1)', '').trim();
        blogData.metadata.title = blogData.content.title;
        blogData.metadata.slug = generateSlug(blogData.content.title);
        contentStarted = true;
        continue;
      }

      if (line.includes('(H2)')) {
        if (currentSection) {
          blogData.content.sections.push(currentSection);
        }
        currentSection = {
          id: generateId(),
          type: 'section',
          heading: line.replace('(H2)', '').trim(),
          level: 2,
          content: [],
          subsections: []
        };
        continue;
      }

      if (line.includes('(H3)')) {
        const headingText = line.replace('(H3)', '').trim();
        
        if (currentSection) {
          currentSection.subsections.push({
            id: generateId(),
            type: 'subsection',
            heading: headingText,
            level: 3,
            content: []
          });
        } else {
          currentSection = {
            id: generateId(),
            type: 'section',
            heading: headingText,
            level: 3,
            content: [],
            subsections: []
          };
        }
        continue;
      }

      // Parse content
      if (contentStarted && line && !line.includes('(H')) {
        const contentItem = parseContentLine(line);
        
        if (currentSection) {
          if (currentSection.subsections.length > 0) {
            const lastSubsection = currentSection.subsections[currentSection.subsections.length - 1];
            lastSubsection.content.push(contentItem);
          } else {
            currentSection.content.push(contentItem);
          }
        } else {
          if (!currentSection) {
            currentSection = {
              id: generateId(),
              type: 'section',
              heading: 'Introduction',
              level: 2,
              content: [],
              subsections: []
            };
          }
          currentSection.content.push(contentItem);
        }
      }
    }

    // Add the last section
    if (currentSection) {
      blogData.content.sections.push(currentSection);
    }

    // Calculate stats
    const allText = content.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length > 0);
    blogData.content.wordCount = allText.length;
    blogData.content.readingTime = Math.ceil(allText.length / 200);

    // Generate SEO keywords
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = allText.map(word => word.toLowerCase()).filter(word => !commonWords.includes(word));
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    blogData.seo.keywords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    return blogData;
  };

  const updateStats = (data) => {
    const headingCount = data.content.sections.length + 
      data.content.sections.reduce((acc, section) => acc + section.subsections.length, 0);
    
    let paragraphCount = 0;
    let bulletCount = 0;
    
    data.content.sections.forEach(section => {
      section.content.forEach(item => {
        if (item.type === 'paragraph') paragraphCount++;
        if (item.type === 'bullet_point') bulletCount++;
      });
      section.subsections.forEach(subsection => {
        subsection.content.forEach(item => {
          if (item.type === 'paragraph') paragraphCount++;
          if (item.type === 'bullet_point') bulletCount++;
        });
      });
    });

    setStats({
      wordCount: data.content.wordCount,
      headingCount,
      paragraphCount,
      bulletCount
    });
  };

  const parseContent = () => {
    if (!content.trim()) {
      showNotification('Please enter some content to parse', 'error');
      return;
    }

    try {
      const parsed = parseGoogleDocContent(content);
      setParsedData(parsed);
      updateStats(parsed);
      showNotification('Content parsed successfully!');
    } catch (error) {
      showNotification('Error parsing content: ' + error.message, 'error');
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setContent(e.target.result);
      showNotification('File loaded successfully!');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const copyJSON = async () => {
    if (!parsedData) {
      showNotification('No data to copy. Please parse content first.', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2));
      showNotification('JSON copied to clipboard!');
    } catch {
      showNotification('Failed to copy to clipboard', 'error');
    }
  };

  const downloadJSON = () => {
    if (!parsedData) {
      showNotification('No data to download. Please parse content first.', 'error');
      return;
    }

    const blob = new Blob([JSON.stringify(parsedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog_${parsedData.metadata.slug || 'export'}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('JSON file downloaded!');
  };

  const saveToDatabase = async () => {
    if (!parsedData) {
      showNotification('No data to save. Please parse content first.', 'error');
      return;
    }

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData)
      });

      if (response.ok) {
        const result = await response.json();
        showNotification(`Blog saved successfully! ID: ${result.id}`);
        // Clear the form after successful save
        setContent('');
        setParsedData(null);
        setStats({ wordCount: 0, headingCount: 0, paragraphCount: 0, bulletCount: 0 });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.log('API call would be made with data:', parsedData);
      showNotification('Demo: Blog data ready for API call! Check console for details.');
    }
  };

  const clearAll = () => {
    setContent('');
    setParsedData(null);
    setStats({ wordCount: 0, headingCount: 0, paragraphCount: 0, bulletCount: 0 });
    showNotification('Content cleared successfully!');
  };

  const renderPreview = () => {
    if (!parsedData) {
      return (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
          <p>Preview will appear here after parsing content</p>
        </div>
      );
    }

    return (
      <div>
        {(parsedData.seo.metaTitle || parsedData.seo.metaDescription) && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
            <h4 style={{ color: '#1e40af', marginBottom: '10px' }}>SEO Meta Information</h4>
            {parsedData.seo.metaTitle && <p><strong>Title:</strong> {parsedData.seo.metaTitle}</p>}
            {parsedData.seo.metaDescription && <p><strong>Description:</strong> {parsedData.seo.metaDescription}</p>}
          </div>
        )}

        {parsedData.content.title && <h1>{parsedData.content.title}</h1>}

        {parsedData.content.sections.map((section) => (
          <div key={section.id}>
            {section.level === 2 ? (
              <h2>{section.heading}</h2>
            ) : (
              <h3>{section.heading}</h3>
            )}

            {section.content.map((item, index) => (
              <div key={index}>
                {item.type === 'paragraph' && <p>{item.content}</p>}
                {item.type === 'bullet_point' && (
                  <ul><li>{item.content}</li></ul>
                )}
                {item.type === 'numbered_item' && (
                  <ol><li>{item.content}</li></ol>
                )}
              </div>
            ))}

            {section.subsections.map((subsection) => (
              <div key={subsection.id}>
                <h3>{subsection.heading}</h3>
                {subsection.content.map((item, index) => (
                  <div key={index}>
                    {item.type === 'paragraph' && <p>{item.content}</p>}
                    {item.type === 'bullet_point' && (
                      <ul><li>{item.content}</li></ul>
                    )}
                    {item.type === 'numbered_item' && (
                      <ol><li>{item.content}</li></ol>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        
        <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', padding: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🚀 Google Doc Parser</h1>
          <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>Convert your Google Doc content to structured database format</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', minHeight: '600px' }}>
          
          <div style={{ padding: '40px', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#1e293b' }}>📝 Input Content</h2>
            
            <div 
              style={{ 
                border: isDragActive ? '3px dashed #4f46e5' : '3px dashed #cbd5e1', 
                borderRadius: '12px', 
                padding: '40px', 
                textAlign: 'center', 
                marginBottom: '20px', 
                cursor: 'pointer',
                background: isDragActive ? '#eff6ff' : '#f8fafc',
                transition: 'all 0.3s'
              }}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div style={{ fontSize: '3rem', color: '#94a3b8', marginBottom: '15px' }}>📄</div>
              <h3 style={{ color: '#64748b', marginBottom: '5px' }}>Drop your file here</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx"
                style={{ display: 'none' }}
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
              />
            </div>

            <textarea
              style={{ 
                width: '100%', 
                minHeight: '300px', 
                padding: '20px', 
                border: '2px solid #e2e8f0', 
                borderRadius: '12px', 
                fontFamily: 'Courier New, monospace', 
                fontSize: '14px', 
                resize: 'vertical',
                outline: 'none'
              }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your Google Doc content here...

Format example:
Meta title: Your Blog Title
Meta description: Your description

Your Blog Title (H1)
Your introduction paragraph... (P)

1. Section Title (H3)
Your section content... (P)
• Bullet point 1 (Bullet)
• Bullet point 2 (Bullet)

[Author: Your Name]"
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                style={{ 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '15px 30px', 
                  borderRadius: '10px', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  flex: '1'
                }} 
                onClick={parseContent}
              >
                🔄 Parse Content
              </button>
              <button 
                style={{ 
                  background: '#6b7280', 
                  color: 'white', 
                  border: 'none', 
                  padding: '15px 30px', 
                  borderRadius: '10px', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  cursor: 'pointer'
                }} 
                onClick={clearAll}
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          <div style={{ padding: '40px', background: 'white' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#1e293b' }}>📊 Parsed Output</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4f46e5' }}>{stats.wordCount}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '5px' }}>Words</div>
              </div>
              <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4f46e5' }}>{stats.headingCount}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '5px' }}>Headings</div>
              </div>
              <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4f46e5' }}>{stats.paragraphCount}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '5px' }}>Paragraphs</div>
              </div>
              <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4f46e5' }}>{stats.bulletCount}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '5px' }}>Bullets</div>
              </div>
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
              <pre style={{ color: '#e2e8f0', fontFamily: 'Courier New, monospace', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: '0' }}>
                {parsedData ? JSON.stringify(parsedData, null, 2) : '{\n  "message": "Paste your content and click \'Parse Content\' to see the structured JSON output"\n}'}
              </pre>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <button style={{ padding: '12px 20px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', flex: '1', background: '#10b981', color: 'white' }} onClick={saveToDatabase}>
                💾 Save to Database
              </button>
              <button style={{ padding: '12px 20px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', flex: '1', background: '#6b7280', color: 'white' }} onClick={copyJSON}>
                📋 Copy JSON
              </button>
              <button style={{ padding: '12px 20px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', flex: '1', background: '#6b7280', color: 'white' }} onClick={downloadJSON}>
                ⬇️ Download JSON
              </button>
            </div>

            <h3 style={{ marginTop: '30px', marginBottom: '15px', color: '#1e293b' }}>👀 Preview</h3>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '30px', background: '#fefefe', maxHeight: '400px', overflowY: 'auto' }}>
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>

      {notification.show && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          background: notification.type === 'error' ? '#ef4444' : '#10b981', 
          color: 'white', 
          padding: '15px 25px', 
          borderRadius: '10px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', 
          zIndex: '1000' 
        }}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AddBlogParser;