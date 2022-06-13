import React, {useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useHistory } from 'react-router';
import { Button, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import userDefaultImg from "../../assets/img/placeholder.png";
import { toast } from "react-toastify";
import { createServices } from './Services.action'
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';

const ServiceCreate = (props) => {

  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(true);
  const history = useHistory();
  const [addService, setAddService] = useState({
      name:'',
      status: true,
      description: '',
      logo:""
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
      setAddForm({ ...addService, logo: '' });
    } else if (checkMimeType(event)) {
      let reader = new FileReader();
      reader.readAsDataURL(file[0])
      reader.onloadend = function () {
        setPic({ image: reader.result })
      }
      setAddService({ ...addService, logo: file[0] })
    } else {
      setAddService({ ...addService, logo: '' });
      toast.error("Unsuccessful in choosing image file");
    }
  };

  const submitAdd = (e) => {
    e.preventDefault();
    if(addService.name === ''){
        setErrors({...errors, name : 'Name is required'})
    }else if(addService.description === ''){
        setErrors({...errors, description : 'Content is required'})
    }else{
      let formData = new FormData()
      for (const key in addService)
        formData.append(key, addService[key])
        props.createServices(formData);
      setAddService({
        name:'',
        status: true,
        description: '',
        logo:''
      })
      setLoader(true);
      history.push('/services')
    }
  }
  return (
    <Container>
      <Form  onSubmit={(e) => { submitAdd (e) }}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" name="name" value={addService.name} onChange={(e) => { setAddService({ ...addService, name: e.target.value }) }} />
            <span style={{ color: "red" }}>{addService.name === "" ? errors["name"] : ""}</span>
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
              setAddService({...addService, description: data })
              // console.log( 'dataaaaaaaaaaaaaa',data );
            } }
            onBlur={ ( event, editor ) => {
              // console.log( 'Blur.', editor );
            } }
            onFocus={ ( event, editor ) => {
              // console.log( 'Focus.', editor );
            } }
          />
            <span style={{ color: "red" }}>{addService.description === "" ? errors["description"] : ""}</span>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <div className="mb-2">
            <img
              src={!addService.logo ? userDefaultImg : pic.image}
              style={{ height: 100, width: 100, objectFit: "contain" }}
            />
            </div>
            <Form.Control type="file" onChange={addPhotoChange} />
          </Form.Group>
          <Form.Group className="switch-wrapper mb-3">
            <span className="d-block mb-2">Status</span>
            <label className="switch">
                <input type="checkbox" name="status" checked={addService.status ? true : false} onChange={(e) => {
                  setAddService({ ...addService, status: e.target.checked })
                }} />
                <span className="slider round"></span>
            </label>
          </Form.Group>
          <Button variant="primary" type="submit" className="yellow-bg">
            Add Service
          </Button>
      </Form>
    </Container>
  )
}

export default connect(null, {createServices})(ServiceCreate)