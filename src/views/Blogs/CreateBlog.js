import React, {useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router';
import { Button, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { createBlog } from './Blogs.action';
import userDefaultImg from "../../assets/img/placeholder.png";

const CreateBlog = (props) => {
    const [addBlog, setAddBlog] = useState({
        title:'',
        excerpt: '',
        status: true,
        description: '',
        image: '',
        category: '',
        });

    const [errors, setErrors] = useState({});

    const history = useHistory();

    const [pic, setPic] = useState({
        image: null,
        _id:'',
      });
  
    const checkMimeType = (event) => {
      //getting file object
      let file = event.target.files;
      //define message container
      let err = "";
      // list allow mime type
      const types = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/svg",
        "image/gif",
      ];
  
      // compare file type find doesn't matach
      if (types.every((type) => file[0].type !== type)) {
        // create error message and assign to container
        err = file[0].type + " is not a supported format";
      }
  
      if (err !== "") {
        // if message not same old that mean has error
        event.target.value = null; // discard selected file
        return false;
      }
      return true;
    };
  
    const addPhotoChange = (event) => {
      const file = event.target.files;
      if (file.length === 0) {
        setAddBlog({ ...addBlog, image: '' });
      } else if (checkMimeType(event)) {
        let reader = new FileReader();
        reader.readAsDataURL(file[0])
        reader.onloadend = function () {
          setPic({ image: reader.result })
        }
        setAddBlog({ ...addBlog, image: file[0] })
      } else {
        setAddBlog({ ...addBlog, image: '' });
        toast.error("Unsuccessful in choosing image file");
      }
    };

    const submitAdd = (e) => {
        e.preventDefault();
        if(addBlog.title.trim() === ''){
            setErrors({...errors, title : 'Title is required'})
        }else if(addBlog.excerpt.trim() === ''){
            setErrors({...errors, excerpt : 'Excerpt is required'})
        }else if(addBlog.description.trim() === ''){
            setErrors({...errors, description : 'Description is required'})
        }else{  
            let formData = new FormData()
            for (const key in addBlog)
                formData.append(key, addBlog[key])
                props.createBlog(formData);
                setAddBlog({
                    title:'',
                    excerpt: '',
                    status: true,
                    description: '',
                    image: '',
                    category: '',
                })
                setLoader(true);
                history.push('/blog')
            }
        // console.log(`values of cms form>>>`, addBlog)
    }

  return (
    <Container>
        <Form  onSubmit={(e) => { submitAdd(e) }}>
            <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <div className="mb-2">
                <img
                src={!addBlog.image ? userDefaultImg : pic.image}
                style={{ height: 100, width: 100, objectFit: "contain" }}
                />
                </div>
                <Form.Control type="file" onChange={addPhotoChange} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter title" name="title" value={addBlog.title} onChange={(e) => { setAddBlog({ ...addBlog, title: e.target.value }) }} />
                <span style={{ color: "red" }}>{errors["title"]}</span>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Excerpt</Form.Label>
                <Form.Control type="text" placeholder="Enter excerpt" name="excerpt" value={addBlog.excerpt} onChange={(e) => { setAddBlog({ ...addBlog, excerpt: e.target.value }) }} />
                <span style={{ color: "red" }}>{errors["excerpt"]}</span>
            </Form.Group>
            <Form.Group className="switch-wrapper mb-3">
                <span className="d-block mb-2">Status</span>
                <label className="switch">
                    <input type="checkbox" name="status" checked={addBlog.status ? true : false} onChange={(e) => {
                        setAddBlog({ ...addBlog, status: e.target.checked })
                    }} />
                    <span className="slider round"></span>
                </label>
            </Form.Group>
            <Form.Group>
            <Form.Label>Description</Form.Label>
            <CKEditor
                    editor={ ClassicEditor }
                    data=""
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        // console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        setAddBlog({...addBlog, description: data })
                        // console.log( 'dataaaaaaaaaaaaaa',data );
                    } }
                    onBlur={ ( event, editor ) => {
                        // console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        // console.log( 'Focus.', editor );
                    } }
                />
                <span style={{ color: "red" }}>{errors["description"]}</span>
            </Form.Group>
            <Button variant="primary" type="submit" className="yellow-bg">
                Add Blog
            </Button>
        </Form>
    </Container>
  )
}

export default connect(null, {createBlog})(CreateBlog)