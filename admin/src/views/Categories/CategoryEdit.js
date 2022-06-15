import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router';
import { Button, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import userDefaultImg from "../../assets/img/placeholder.png";
import { toast } from "react-toastify";
import { updateCategory, getCategory, beforeCategory } from './Category.action'
import imagePlaceholder from "assets/img/placeholder.png";
import { ENV } from "../../config/config";
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';

const CategoryEdit = (props) => {

    let id = props.match.params.id;
    console.log(`id---,.,,.`, props)

  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(true);
  const history = useHistory();
  const [editCategory, setEditCategory] = useState(null);
  const [pic, setPic] = useState({
      image: null,
      _id:'',
    });

    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.getCategory(id);
    }, [])  

    useEffect( () => {
        if (props.category.getAuth) {
            let {getCategory} =  props?.category;
            setEditCategory(getCategory)
            setLoader(false)
        }
    }, [props.category.getAuth])

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

  const EditPhotoChange = (event) => {
    const file = event.target.files;
    if (file.length === 0) {
        setEditCategory({ ...editCategory, image: '' });
    } else if (checkMimeType(event)) {
      let reader = new FileReader();
      reader.readAsDataURL(file[0])
      reader.onloadend = function () {
        setPic({ image: reader.result })
      }
      setEditCategory({ ...editCategory, image: file[0] })
    } else {
        setEditCategory({ ...editCategory, image: '' });
      toast.error("Unsuccessful in choosing image file");
    }
  };

  const submitEdit = (e) => {
    e.preventDefault();
    if(editCategory.title === ''){
        setErrors({...errors, title : 'Title is required'})
    }
    else{
        let formData = new FormData()
        for (const key in editCategory)
         formData.append(key, editCategory[key])
        props.updateCategory(formData);
        setLoader(false);
     
        history.push('/categories')
    }
  }
  return (
    <Container>
        {loader ? <FullPageLoader /> : <Form  onSubmit={(e) => { submitEdit (e) }}>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter title" name="title" value={editCategory?.title} onChange={(e) => { setEditCategory({ ...editCategory, title: e.target.value }) }} />
                <span style={{ color: "red" }}>{editCategory.title === "" ? errors["title"] : ""}</span>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" placeholder="Enter email" name="email" value={editCategory?.email} onChange={(e) => { setEditCategory({ ...editCategory, email: e.target.value }) }} />
                <span style={{ color: "red" }}>{editCategory.email === "" ? errors["email"] : ""}</span>
            </Form.Group>
            
            

            <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <div className="mb-2">
                <img
                 src={editCategory?.image ? typeof editCategory?.image === 'string' ? `${ENV.Backend_Img_Url}${editCategory?.image}` : URL.createObjectURL(editCategory?.image) : imagePlaceholder}
                  style={{ height: 100, width: 100, objectFit: "contain" }}
                />
                </div>
                <Form.Control type="file" onChange={EditPhotoChange} />
            </Form.Group>

            <Form.Group className="switch-wrapper mb-3">
                <span className="d-block mb-2">Status</span>
                <label className="switch">
                    <input type="checkbox" name="status" checked={editCategory?.status ? true : false} onChange={(e) => {
                        setEditCategory({ ...editCategory, status: e.target.checked })
                    }} />
                    <span className="slider round"></span>
                </label>
            </Form.Group>

            <Button variant="primary" type="submit" className="yellow-bg">
                Edit Category
            </Button>
        </Form>}
    </Container>
  )
}
const mapStateToProps = state => ({
    category: state.category,
    error: state.error
})

export default connect(mapStateToProps, {updateCategory, getCategory, beforeCategory})(CategoryEdit)