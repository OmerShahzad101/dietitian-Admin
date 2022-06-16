import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Container, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { beforeBlog, getBlog, updateBlog } from './Blogs.action';
import { toast } from 'react-toastify';
import imagePlaceholder from "assets/img/placeholder.png";
import { ENV } from "../../config/config";

const EditBlog = (props) => {
    let id = props.match.params.id;
    const [editBlog, setEditBlog] = useState(null);
    const [loader, setLoader] = useState(true);
    const [errors, setErrors] = useState({});
    const history = useHistory();
    const [categoriesList, setCategoriesList] = useState(null)
    useEffect(()=>{
      fetch(`${ENV.url}category/list`).then(res => res.json()).then((res)=>{
        console.log(res.data.category)
        setCategoriesList(res?.data?.category)
      })
    },[])
    const [pic, setPic] = useState({
        image: null,
        _id:'',
      });
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
            setEditCategory({ ...editBlog, image: '' });
        } else if (checkMimeType(event)) {
          let reader = new FileReader();
          reader.readAsDataURL(file[0])
          reader.onloadend = function () {
            setPic({ image: reader.result })
          }
          setEditBlog({ ...editBlog, image: file[0] })
        } else {
            setEditBlog({ ...editBlog, image: '' });
          toast.error("Unsuccessful in choosing image file");
        }
      };

    const submitEdit = (e) => {
        e.preventDefault();
        if(editBlog.title.trim() === ''){
            setErrors({...errors, title : 'Title is required'})
        }else if(editBlog.description.trim() === ''){
            setErrors({...errors, description : 'Description is required'})
        }
        else if(editBlog.excerpt.trim() === ''){
            setErrors({...errors, excerpt : 'Excerpt is required'})
        }
        else if(editBlog.category.trim() === ''){
            setErrors({...errors, category : 'Category is required'})
        }else{
            let formData = new FormData()
            for (const key in editBlog)
             formData.append(key, editBlog[key])
             
            props.updateBlog(formData);
            setLoader(false);
            history.push('/blogs')
        }
    }
    return (
        <Container>
            {
                loader ? <FullPageLoader /> :
                    <Form  onSubmit={(e) => { submitEdit(e) }}>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <div className="mb-2">
                            <img
                                src={editBlog?.image ? typeof editBlog?.image === 'string' ? `${ENV.Backend_Img_Url}${editBlog?.image}` : URL.createObjectURL(editBlog?.image) : imagePlaceholder}
                                style={{ height: 100, width: 100, objectFit: "contain" }}
                            />
                            </div>
                            <Form.Control type="file" onChange={EditPhotoChange} />
                         </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" name="title" value={editBlog?.title} onChange={(e) => { setEditBlog({ ...editBlog, title: e.target.value }) }} />
                            <span style={{ color: "red" }}>{errors["title"]}</span>
                        </Form.Group>
                        <Form.Label> Select Category </Form.Label>
                            <select className='form-control form-select mb-3' name="category" value={editBlog.category} onChange={(e) => {
                                setEditBlog({ ...editBlog,category:e.target.value })
                            }}>
                                {
                                categoriesList?.map((data,i) => {
                                return (
                                    <option key={i} value={data?._id} selected={data?._id === editBlog.category ? 'selected' : ''} required>{data.title}</option>
                                    );
                                })
                                }
                            </select>
                            <span style={{ color: "red" }}>{errors["category"]}</span>
                        <Form.Group className="mb-3">
                            <Form.Label>Excerpt</Form.Label>
                            <Form.Control type="text" placeholder="Enter excerpt" name="excerpt" value={editBlog?.excerpt} onChange={(e) => { setEditBlog({ ...editBlog, excerpt: e.target.value }) }} />
                            <span style={{ color: "red" }}>{errors["excerpt"]}</span>
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
                            <Form.Label>Description</Form.Label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={editBlog?.description}
                                content={editBlog?.description}
                                onReady={editor => {
                                    // You can store the "editor" and use when it is needed.
                                    // console.log( 'Editor is ready to use!', editor );
                                    const data = editor.getData();
                                    // console.log('DATA: ', data)
                                    setEditBlog({ ...editBlog, description: data })
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setEditBlog({ ...editBlog, description: data })
                                }}
                                onBlur={(event, editor) => {
                                    // console.log( 'Blur.', editor );
                                }}
                                onFocus={(event, editor) => {
                                    // console.log( 'Focus.', editor );
                                }}
                            />
                            <span style={{ color: "red" }}>{errors["description"]}</span>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="yellow-bg">
                            Edit Blog
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