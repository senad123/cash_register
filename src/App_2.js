import {useState} from 'react';
import './style.css';

const initialItems = [
  {
    id: 1,
    itemName: "Banana",
    price: 7,
    type:"food"

  },
  {
    id: 2,
    itemName: "Apple",
    price: 20,
    type:"food"
  },
  {
    id: 3,
    itemName: "Orange",
    price: 4,
    type:"food"
  },
  {
    id: 4,
    itemName: "Pear",
    price: 4,
    type:"food"
  },
  {
  id: 5,
  itemName: "Espresso",
  price: 4,
  type:"drink"
},
];

function Button({children, onClick}){
  return <button className='button' onClick={onClick}>{children}</button>
}
export default function App() {
  const [showAddItem, setShowAddItem] = useState(false);
  //const[item, setItem] = useState(items);

  function handleShowAddItem(){
    setShowAddItem((currState)=>!currState)
  }

  return (
    <><Header/>
    <div className='app'>
      
      <div className='sidebar'>
        <ItemList/>
      
      {showAddItem && <FormAddItem/>}
     
      <Button onClick={handleShowAddItem}>{showAddItem ? "Close":"AddItem"}</Button>
      
      </div>
    <FormSetQuantity/>


    </div>
    </>
  );
}

function Header (){
  return <h1>CashRegister</h1>;
}

function ItemList(){
  const items = initialItems;
  return (
    <ul>{items.map((itemObj)=>(
      <Item itemObj={itemObj} key={itemObj.id}/>
      ))}

    </ul>
    );
}
function Item({itemObj}){
  return <li>
    <h3>{itemObj.itemName}</h3>
    <p><span>Quantity: </span> 4  
    <span>Price: </span>{itemObj.price}€</p>


   <Button>Select</Button>
  </li>


}



function FormAddItem(){
  return <form className='form-add-item'>
    <label>ItemName</label>
    <input type='text'></input>

    <label>ItemPrice</label>
    <input type='text'></input>
    <label>Type </label>
    <select>
      <option>food</option>
      <option>drink</option>
    </select>

    <Button>AddItem</Button>
  </form>
}

function FormSetQuantity(){
  return <form className='form-set-item'>
    <h2>Change quantity of X</h2>
    <label>SetQuantity</label>
    <input type='text'></input>
    <Button>AddItem</Button>
  </form>
}