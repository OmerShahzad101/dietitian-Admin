import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { beforeBlog, getBlog, updateBlog } from './Blogs.action';
import { toast } from 'react-toastify';

const EditBlog = (props) => {
    let id = props.match.params.id;
    const [editBlog, setEditBlog] = useState(null);
    const [loader, setLoader] = useState(true);
    const [errors, setErrors] = useState({});
    const history = useHistory();
    
    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.getBlog(id);
    }, [])

    // useEffect(() => {
    //     // if (editBlog.name ==! '' && editBlog.status ==! null) {
    //     //     setLoader(false)
    //     // }
    // }, [editBlog.status])

    useEffect(async () => {
        if (props.blog.getAuth) {
            let blog = await props.blog.getBlog;
            setEditBlog(blog)
            setLoader(false)
        }
    }, [props.blog.getAuth])

    const submitEdit = (e) => {
        e.preventDefault();
        if(editBlog.name.trim() === ''){
            setErrors({...errors, name : 'Name is required'})
        }else if(editBlog.content.trim() === ''){
            setErrors({...errors, content : 'Content is required'})
        }else{
            props.updateBlog(editBlog);
            setEditBlog(null)
            props.beforeBlog()
            history.push('/blog')
        }
    }
    return (
        <Container>
            {
                loader ? <FullPageLoader /> :
                    <Form  onSubmit={(e) => { submitEdit(e) }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" name="name" value={editBlog?.name} onChange={(e) => { setEditBlog({ ...editBlog, name: e.target.value }) }} />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                        </Form.Group>
                        <Form.Group className="switch-wrapper mb-3">
                            <span className="d-block mb-2">Status</span>
                            <label className="switch">
                                <input type="checkbox" name="status" checked={editBlog?.status ? true : false} onChange={(e) => {
                                    setEditBlog({ ...editBlog, status: e.target.checked })
                                }} />
                                <span className="slider round"></span>
                            </label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Content</Form.Label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={editBlog?.content}
                                content={editBlog?.content}
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    // console.log( 'Editor is ready to use!', editor );
                                    const data = editor.getData();
                                    // console.log('DATA: ', data)
                                    setEditBlog({ ...editBlog, content: data })
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setEditBlog({ ...editBlog, content: data })
                                }}
                                onBlur={(event, editor) => {
                                    // console.log( 'Blur.', editor );
                                }}
                                onFocus={(event, editor) => {
                                    // console.log( 'Focus.', editor );
                                }}
                            />
                            <span style={{ color: "red" }}>{errors["content"]}</span>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="yellow-bg">
                            Edit CMS
                        </Button>
                    </Form>}
        </Container>
    )
}

const mapStateToProps = state => ({
    blog: state.blog,
    error: state.error
})

export default connect(mapStateToProps, { getBlog, updateBlog, beforeBlog })(EditBlog)