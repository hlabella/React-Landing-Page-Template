import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";


const EditorBlog = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [editor, setEditor] = useState(
        "<p>Hello world</p><img src='https://images.unsplash.com/photo-1673859360509-1ef362f94f0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NjMzNjE2OA&ixlib=rb-4.0.3&q=80&w=1080' />"
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        const checkStaffStatus = async () => {
            const response = await fetch(`${apiUrl}/api/check-user-staff-status/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`
                },
            });
            const data = await response.json();
            if (!data.isStaff) {
                navigate('/');
            }
        };
        checkStaffStatus();
    }, [navigate]);

    function uploadAdapter(loader){
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        return {
            upload : () => {
                return new Promise((resolve , reject) => {
                    const body = new FormData();
                    loader.file.then((file) => {
                        body.append("uploadImg", file);
                        fetch(`${apiUrl}/api/uploadImg/`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Token ${token}`,
                            },
                            body: body
                        })
                        .then((res) => res.json())
                        .then((res) => {
                            resolve({ default: `${apiUrl}${res.url}`})
                        })
                        .catch((err) => {
                            reject(err);
                        })
                    })
                })
            } 
        }
    };

    function uploadPlugin(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        // Check for token or handle unauthenticated state appropriately
        if (!token) {
            navigate('/login');
            return;
        }
    
        try {
            const response = await fetch(`${apiUrl}/api/save-post/`, { 
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content: editor
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to save post');
            }
    
            const data = await response.json();
            navigate('/posts');

        } catch (error) {
            console.error('Error saving post:', error);
            // Handle error, e.g., show an error message
        }
    };

    return (
        <div className='patients-table'>
            <input
                type="text"
                placeholder="Título do Post"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <CKEditor
                config={{
                // @ts-ignore
                extraPlugins: [uploadPlugin]
                }}
                editor={ClassicEditor}
                onReady={(editor) => {}}
                onBlur={(event, editor) => {}}
                onFocus={(event, editor) => {}}
                onChange={(event, editor) => {
                setEditor(editor.getData());
                }}
                data={editor}
            />
            <button style={{background:"green"}} onClick={handleSubmit}>Save Post</button>
        </div>
    );
};

export default EditorBlog;
