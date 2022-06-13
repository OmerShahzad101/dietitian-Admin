import React, {useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router';
import { Button, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import userDefaultImg from "../../assets/img/placeholder.png";
import { toast } from "react-toastify";
import { createCategory } from './Category.action'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';

const CategoryCreate = (props) => {

  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(true);
  const history = useHistory();
  const [addCategory, setAddCategory] = useState({
      title:'',
      status: true,
      description: '',
      image:""
  });
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
      setAddForm({ ...addCategory, image: '' });
    } else if (checkMimeType(event)) {
      let reader = new FileReader();
      reader.readAsDataURL(file[0])
      reader.onloadend = function () {
        setPic({ image: reader.result })
      }
      setAddCategory({ ...addCategory, image: file[0] })
    } else {
      setAddCategory({ ...addCategory, image: '' });
      toast.error("Unsuccessful in choosing image file");
    }
  };

  const submitAdd = (e) => {
    e.preventDefault();
    if(addCategory.title === ''){
        setErrors({...errors, title : 'Name is required'})
    }else if(addCategory.category === ''){
        setErrors({...errors, category : 'Email is required'})
    }else{
      let formData = new FormData()
      for (const key in addCategory)
        formData.append(key, addCategory[key])
        props.createCategory(formData);
      setAddCategory({
        title:'',
        status: true,
        email: '',
        image:''
      })
      setLoader(true);
      history.push('/categories')
    }
  }
  return (
    <Container>
      <Form  onSubmit={(e) => { submitAdd (e) }}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter title" name="title" value={addCategory.title} onChange={(e) => { setAddCategory({ ...addCategory, title: e.target.value }) }} />
            <span style={{ color: "red" }}>{addCategory.title === "" ? errors["title"] : ""}</span>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder="Enter email" name="email" value={addCategory.email} onChange={(e) => { setAddCategory({ ...addCategory, email: e.target.value }) }} />
            <span style={{ color: "red" }}>{addCategory.email === "" ? errors["email"] : ""}</span>
          </Form.Group>
         
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <div className="mb-2">
            <img
              src={!addCategory.image ? userDefaultImg : pic.image}
              style={{ height: 100, width: 100, objectFit: "contain" }}
            />
            </div>
            <Form.Control type="file" onChange={addPhotoChange} />
          </Form.Group>
          <Form.Group className="switch-wrapper mb-3">
            <span className="d-block mb-2">Status</span>
            <label className="switch">
                <input type="checkbox" name="status" checked={addCategory.status ? true : false} onChange={(e) => {
                  setAddCategory({ ...addCategory, status: e.target.checked })
                }} />
                <span className="slider round"></span>
            </label>
          </Form.Group>
          <Button variant="primary" type="submit" className="yellow-bg">
            Add Category
          </Button>
      </Form>
    </Container>
  )
}

export default connect(null, {createCategory})(CategoryCreate)