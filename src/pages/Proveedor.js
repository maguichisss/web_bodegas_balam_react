import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:8080/proveedor/";
const head = {
  method: "",
  url: url,
  params:{},
  data:{}
}

class Proveedor extends Component {
  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
      id: '',
      name: '',
      short_name: '',
      tipoModal: ''
    }
  }

  peticionGet=()=>{
    head.method = "get"
    axios(head)
    .then(response=>{
      this.setState({data: response.data.data});
    })
    .catch(error=>{
      if (error.response){
        console.log(error.response.data);
        console.log(error.response);
      }else if(error.request){
        console.log(error.request);
        console.log(error.message);
      }else if(error.message){
        console.log(error.message);
      }
    })
  }

  peticionDelete=()=>{
    head.method = "delete"
    head.data = {id:[this.state.form.id]}
    axios(head).then(response=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    })
    .catch(error=>{
      if (error.response){
        console.log(error.response.data);
        console.log(error.response);
      }else if(error.request){
        console.log(error.request);
        console.log(error.message);
      }else if(error.message){
        console.log(error.message);
      }
    })
  }

  peticionPatch=()=>{
    head.method = "patch"
    head.data = [this.state.form]
    axios(head).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })
    .catch(error=>{
      if (error.response){
        console.log(error.response.data);
        console.log(error.response);
      }else if(error.request){
        console.log(error.request);
        console.log(error.message);
      }else if(error.message){
        console.log(error.message);
      }
    })
  }

  peticionPost=async()=>{
    delete this.state.form.id;
    head.method = "post"
    head.data = [this.state.form]
    console.log(head.data)
    await axios(head).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })
    .catch(error=>{
      if (error.response){
        console.log(error.response.data);
        console.log(error.response);
      }else if(error.request){
        console.log(error.request);
        console.log(error.message);
      }else if(error.message){
        console.log(error.message);
      }
    })
  }

  componentDidMount() {
    this.peticionGet();
  }

  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  seleccionarItem=(item)=>{
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: item.id,
        name: item.name,
        short_name: item.short_name
      }
    })
  }

  handleChange=async e=>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    //console.log(this.state.form);
  }

  render(){
    const {form}=this.state;
    return (
      <div className="App">
        <button className="btn btn-success" 
          onClick={()=>{
            this.setState({form: null, tipoModal: 'insertar'});
            this.modalInsertar()
            }
          }
        >
          Nuevo estatus
        </button>
        <br /><br />
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Proveedor</th>
              <th>Alias</th>
              <th>Editar/Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(item=>{
              return(
                <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.short_name}</td>
                <td>
                  <button className="btn btn-primary" onClick={()=>{this.seleccionarItem(item); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                  &nbsp;
                  <button className="btn btn-danger" onClick={()=>{this.seleccionarItem(item); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{display: 'block'}}>
            <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              {form && form.id?
                <>
                <label hidden htmlFor="id">ID</label>
                <input className="form-control" hidden type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form.id}/>
                </>
                : null
              }
              <label htmlFor="name">Proveedor</label>
              <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={form?form.name: ''}/>
              <label htmlFor="short_name">Alias</label>
              <input className="form-control" type="text" name="short_name" id="short_name" onChange={this.handleChange} value={form && form.short_name?form.short_name: ''}/>
            </div>
          </ModalBody>
          <ModalFooter>
                {this.state.tipoModal==='insertar'?
                  <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>:
                  <button className="btn btn-primary" onClick={()=>this.peticionPatch()}>
                    Actualizar
                  </button>
                }
                  <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
              </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
              Estás seguro que deseas eliminar el proveedor "{form && form.name}"
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Proveedor;
