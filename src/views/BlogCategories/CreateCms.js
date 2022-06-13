import React, {useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router';
import { Button, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { createCms } from './Cms.action';

const CreateCms = (props) => {
    const [addCms, setAddCms] = useState({
        name:'',
        status: true,
        content: ''
    });

    const [errors, setErrors] = useState({});

    const history = useHistory();

    const submitAdd = (e) => {
        e.preventDefault();
        if(addCms.name.trim() === ''){
            setErrors({...errors, name : 'Name is required'})
        }else if(addCms.content.trim() === ''){
            setErrors({...errors, content : 'Content is required'})
        }else{
            props.createCms(addCms);
            setAddCms({
                status:true,
            })
            history.push('/cms')
        }
        // console.log(`values of cms form>>>`, addCms)
    }

  return (
    <Container>
        <Form  onSubmit={(e) => { submitAdd(e) }}>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" name="name" value={addCms.name} onChange={(e) => { setAddCms({ ...addCms, name: e.target.value }) }} />
                <span style={{ color: "red" }}>{errors["name"]}</span>
            </Form.Group>
            <Form.Group className="switch-wrapper mb-3">
                <span className="d-block mb-2">Status</span>
                <label className="switch">
                    <input type="checkbox" name="status" checked={addCms.status ? true : false} onChange={(e) => {
                        setAddCms({ ...addCms, status: e.target.checked })
                    }} />
                    <span className="slider round"></span>
                </label>
            </Form.Group>
            <Form.Group>
            <Form.Label>Content</Form.Label>
            <CKEditor
                    editor={ ClassicEditor }
                    data=""
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        // console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        setAddCms({...addCms, content: data })
                        // console.log( 'dataaaaaaaaaaaaaa',data );
                    } }
                    onBlur={ ( event, editor ) => {
                        // console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        // console.log( 'Focus.', editor );
                    } }
                />
                <span style={{ color: "red" }}>{errors["content"]}</span>
            </Form.Group>
            <Button variant="primary" type="submit" className="yellow-bg">
                Add CMS
            </Button>
        </Form>
    </Container>
  )
}

export default connect(null, {createCms})(CreateCms)