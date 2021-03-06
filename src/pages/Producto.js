import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:8080/producto/";
const head = {
  method: "",
  url: url,
  //headers: {
  //'Content-Type': 'application/json',
  //'Access-Control-Allow-Origin': '*',
  //},
  params:{},
  data:{}
}

class Producto extends Component {
  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
      id: '',
      name: '',
      size: '',
      id_tipo: '',
      tipoModal: ''
    }
  }
  tipos_productos = [];
  constructor(){
    super()
    head.method = "get"
    axios.get("http://localhost:8080/tipo_producto/")
    .then(response=>{
      this.tipos_productos = response.data.data;
      //console.log(this.tipos_productos);
      //this.setState({data: response.data.data});
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

  peticionGet=()=>{
    //head.params = {id:"192,203,231"} // or
    //head.data = {id:[190,200,199]}
    head.method = "get"
    axios(head)
    .then(response=>{
      //console.log(response.data.data);
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
    //head.data = {id:[190,200,199]}
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
    //head.data = [{'name': 'new_'+ahora, "id": 283}, {'name': '_new'+ahora, "id": 284}]
    head.method = "patch"
    head.data = [this.state.form]
    //console.log(this.state.form)
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
    //const ahora = Date.now();
    //head.data = [{'name': 'new_'+ahora, "size": 700, "id_tipo": 71}, {'name': '_new'+ahora, "size": 500, "id_tipo": 72}]
    delete this.state.form.id;
    head.method = "post"
    head.data = [this.state.form]
    console.log([this.state.form])
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

  seleccionarProducto=(producto)=>{
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: producto.id,
        name: producto.name,
        size: producto.size,
        id_tipo: producto.id_tipo
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
    console.log(this.state.form);
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
          Nuevo Producto
        </button>
        <br /><br />
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tamaño/Mililitros</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(item=>{
              return(
                <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.size}ml</td>
                <td>{item.tipo.tipo}</td>
                <td>
                  <button className="btn btn-primary" onClick={()=>{this.seleccionarProducto(item); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                  &nbsp;
                  <button className="btn btn-danger" onClick={()=>{this.seleccionarProducto(item); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
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
              <label htmlFor="name">Nombre</label>
              <input className="form-control" type="text" name="name" id="name" onChange={this.handleChange} value={form?form.name: ''}/>
              <br />
              <label htmlFor="size">Tamaño/Mililitros</label>
              <input className="form-control" type="text" name="size" id="size" onChange={this.handleChange} value={form?form.size: ''}/>
              <br />
              <label htmlFor="id_tipo">Tipo</label>
              <select className="form-control" name="id_tipo" id="id_tipo" onChange={this.handleChange} defaultValue={form?form.id_tipo: ''}>
              {this.tipos_productos.map(item=>{
                return(
                  <option key={item.id} className="form-control" value={item.id}>{item.tipo}</option>
                  )
              })}
              </select>
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
              Estás seguro que deseas eliminar el producto {form && form.name}
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

export default Producto;
