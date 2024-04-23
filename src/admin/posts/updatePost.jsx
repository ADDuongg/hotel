import { React, useEffect, useState } from 'react';
import http from '../../Axios';
import ReactQuill from 'react-quill';
import Master from '../master';
import { Link, useParams } from 'react-router-dom';
import swal from 'sweetalert';
const UpdatePost = () => {
    const params = useParams();
    const [post, setPost] = useState({})
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [status, setStatus] = useState(1)
    const [selectImage, setSelectImage] = useState(null);
    useEffect(() => {
        http.get('/sanctum/csrf-cookie').then(res => {
            http.get(`/api/post/${params.id}`)
                .then(res => {
                    const postData = res.data.posts;
                    setPost(postData);
                    setTitle(postData.title);
                    setContent(postData.content);
                    setStatus(postData.status);
                })
        })
    }, [])

    function handleTitle(e) {
        setTitle(e.target.value)
    }
    function handleContent(e) {
        setContent(e.target.value)
    }
    
    function handleStatus(e) {
        setStatus(e.target.value)
    }
    const handleImages = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectImage(file);
        }
    };

    function handleSave() {

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', status);
        formData.append('_method', 'PUT')
        if (selectImage) {
            formData.append('image', selectImage);
        }
        /* debugger */
        http.post(`/api/updatePost/${params.id}`, formData, {
            /*  _method: 'PUT', */
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                if (res.data.status === 200) {
                    swal('Thông báo', res.data.message, 'success')
                }
            })
            .catch(error => {
                console.error('Error:', error);

            });
    }

    function handleReset() {
        setTitle('')
        setContent('')
        setStatus(1)
        setSelectImage(null)
    }
    
    return (
        <div>
            <div>
                <Master>
                    <section className='addPost mt-5'>
                        <div className="container">
                            <div className="row">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item"><Link style={{ fontSize: '20px' }} to={'/admin'} href="#">Home</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page" style={{ fontSize: '20px' }}><Link style={{ fontSize: '20px' }} to={'/admin/post'} href="#">Posts</Link></li>
                                        <li className="breadcrumb-item active" aria-current="page" style={{ fontSize: '20px' }}>Update Post</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="row  mt-3 g-4">
                                <div className="bg-white col-lg-8 col-md-6 col-12 shadow me-3 p-3" style={{ borderRadius: '10px' }}>
                                    <div className='mb-2' style={{ height: '5rem' }}>
                                        <label htmlFor="" className='d-flex'><h5>Title</h5> <div className='text-danger ms-1'>*</div></label>
                                        <input
                                            type="text"
                                            className="form-control h-100"
                                            name="title"
                                            value={title}
                                            onChange={handleTitle}
                                            placeholder="Edit Title here..."
                                        />
                                    </div>
                                    <div className='my-5' style={{ height: '15rem' }}>
                                        <label htmlFor="" className='d-flex'><h5>Content</h5> <div className='text-danger ms-1'>*</div></label>
                                        <textarea type="text" className='form-control h-100' name='content' onChange={handleContent} >{post.content}</textarea>

                                    </div>
                                    <div className='mb-3 mt-5'>
                                        <label htmlFor="" className='d-flex'><h5>Status</h5> <div className='text-danger ms-1'>*</div></label>
                                        <select value={status} onChange={handleStatus} name="status" id="" className='form-control'>
                                            <option value="1">Hiển thị</option>
                                            <option value="0">Ẩn</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="bg-white col-lg-3 col-md-6 col-12 shadow  py-3" style={{ borderRadius: '10px' }}>
                                    <div className="container px-0">
                                        <div className="row">
                                            <h5 className='border-1 border-bottom pb-2'>Action</h5>
                                            <div className='d-flex justify-content-start pt-2 mb-5'>
                                                <button onClick={handleSave} className='btn btn-primary text-white me-3'><i className="fa-solid fa-check me-2"></i>Save</button>
                                                <button onClick={handleReset} className='btn btn-danger'><i className="fa-solid fa-arrow-rotate-left me-2"></i>Reset</button>
                                            </div>
                                            <h5 className='border-1 border-bottom pb-2'>Images</h5>
                                            <div className='mt-3'>
                                                <input onChange={handleImages} name='file' type="file" className='form-control' />
                                                <div className="images w-100 w-100 mt-3">
                                                    {selectImage ? (
                                                        <img src={`${URL.createObjectURL(selectImage)}`} alt="Selected" style={{ width: '100%', height: '80%' }} />
                                                    ) : (
                                                        <img src={`${process.env.REACT_APP_API_BASE_URL}/${post.image_path}`} alt="Selected" style={{ width: '100%', height: '80%' }} />
                                                    )}


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Master>
            </div>
        </div>
    );
}

export default UpdatePost;
