import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router';
import { Button, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import userDefaultImg from "../../assets/img/placeholder.png";
import { toast } from "react-toastify";
import { updateServices, getService, beforeServices } from './Services.action'
import imagePlaceholder from "assets/img/placeholder.png";
import { ENV } from "../../config/config";
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';

const ServicesEdit = (props) => {

    let id = props.match.params.id;
    console.log(`id---,.,,.`, props)

  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(true);
  const history = useHistory();
  const [editService, setEditService] = useState(null);
  const [pic, setPic] = useState({
      image: null,
      _id:'',
    });

    useEffect(() => {
        toast.dismiss();
        window.scroll(0, 0);
        props.getService(id);
    }, [])  

    useEffect( () => {
        if (props.services.getAuth) {
            let {getServices} =  props?.services;
            setEditService(getServices)
            setLoader(false)
        }
    }, [props.services.getAuth])

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
        setEditService({ ...editService, logo: '' });
    } else if (checkMimeType(event)) {
      let reader = new FileReader();
      reader.readAsDataURL(file[0])
      reader.onloadend = function () {
        setPic({ image: reader.result })
      }
      setEditService({ ...editService, logo: file[0] })
    } else {
        setEditService({ ...editService, logo: '' });
      toast.error("Unsuccessful in choosing image file");
    }
  };

  const submitEdit = (e) => {
    e.preventDefault();
    if(editService.name === ''){
        setErrors({...errors, name : 'Name is required'})
    }
    else if(editService.description === ''){
        setErrors({...errors, description : 'description is required'})
    }
    else{
        let formData = new FormData()
        for (const key in editService)
         formData.append(key, editService[key])
        props.updateServices(formData);
        setLoader(false);
        console.log('testttttt');
        history.push('/services')
    }
  }
  return (
    <Container>
        {loader ? <FullPageLoader /> : <Form  onSubmit={(e) => { submitEdit (e) }}>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" name="name" value={editService?.name} onChange={(e) => { setEditService({ ...editService, name: e.target.value }) }} />
                <span style={{ color: "red" }}>{editService.name === "" ? errors["name"] : ""}</span>
            </Form.Group>
            
            <Form.Group>
            <Form.Label>Description</Form.Label>
            <CKEditor
                editor={ClassicEditor}
                data={editService?.description}
                description={editService?.description}
                onReady={editor => {
                    // You can store the "editor" and use when it is needed.
                    // console.log( 'Editor is ready to use!', editor );
                    const data = editor.getData();
                    // console.log('DATA: ', data)
                    setEditService({ ...editService, description: data })
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditService({ ...editService, description: data })
                }}
                onBlur={(event, editor) => {
                    // console.log( 'Blur.', editor );
                }}
                onFocus={(event, editor) => {
                    // console.log( 'Focus.', editor );
                }}
            />
                <span style={{ color: "red" }}>{editService.description === "" ? errors["description"] : ""}</span>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <div className="mb-2">
                <img
                 src={editService?.logo ? typeof editService?.logo === 'string' ? `${ENV.Backend_Img_Url}${editService?.logo}` : URL.createObjectURL(editService?.logo) : imagePlaceholder}
                  style={{ height: 100, width: 100, objectFit: "contain" }}
                />
                </div>
                <Form.Control type="file" onChange={EditPhotoChange} />
            </Form.Group>

            <Form.Group className="switch-wrapper mb-3">
                <span className="d-block mb-2">Status</span>
                <label className="switch">
                    <input type="checkbox" name="status" checked={editService?.status ? true : false} onChange={(e) => {
                        setEditService({ ...editService, status: e.target.checked })
                    }} />
                    <span className="slider round"></span>
                </label>
            </Form.Group>

            <Button variant="primary" type="submit" className="yellow-bg">
                Edit Service
            </Button>
        </Form>}
    </Container>
  )
}
const mapStateToProps = state => ({
    services: state.services,
    error: state.error
})

export default connect(mapStateToProps, {updateServices, getService, beforeServices})(ServicesEdit)