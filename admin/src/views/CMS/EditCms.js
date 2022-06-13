import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { beforeCms, getCms, updateCms } from './Cms.action';
import { toast } from 'react-toastify';

const EditCms = (props) => {
    let id = props.match.params.id;
    const [editCms, setEditCms] = useState(null);
    const [loader, setLoader] = useState(true);
    const [errors, setErrors] = useState({});
    const history = useHistory();
    
    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.getCms(id);
    }, [])

    // useEffect(() => {
    //     // if (editCms.name ==! '' && editCms.status ==! null) {
    //     //     setLoader(false)
    //     // }
    // }, [editCms.status])

    useEffect(async () => {
        if (props.cms.getAuth) {
            let cms = await props.cms.getCms;
            setEditCms(cms)
            setLoader(false)
        }
    }, [props.cms.getAuth])

    const submitEdit = (e) => {
        e.preventDefault();
        if(editCms.name.trim() === ''){
            setErrors({...errors, name : 'Name is required'})
        }else if(editCms.content.trim() === ''){
            setErrors({...errors, content : 'Content is required'})
        }else{
            props.updateCms(editCms);
            setEditCms(null)
            props.beforeCms()
            history.push('/cms')
        }
    }
    return (
        <Container>
            {
                loader ? <FullPageLoader /> :
                    <Form  onSubmit={(e) => { submitEdit(e) }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" name="name" value={editCms?.name} onChange={(e) => { setEditCms({ ...editCms, name: e.target.value }) }} />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                        </Form.Group>
                        <Form.Group className="switch-wrapper mb-3">
                            <span className="d-block mb-2">Status</span>
                            <label className="switch">
                                <input type="checkbox" name="status" checked={editCms?.status ? true : false} onChange={(e) => {
                                    setEditCms({ ...editCms, status: e.target.checked })
                                }} />
                                <span className="slider round"></span>
                            </label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Content</Form.Label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={editCms?.content}
                                content={editCms?.content}
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    // console.log( 'Editor is ready to use!', editor );
                                    const data = editor.getData();
                                    // console.log('DATA: ', data)
                                    setEditCms({ ...editCms, content: data })
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setEditCms({ ...editCms, content: data })
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
    cms: state.cms,
    error: state.error
})

export default connect(mapStateToProps, { getCms, updateCms, beforeCms })(EditCms)