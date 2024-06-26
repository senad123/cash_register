//
import { useState } from "react";
import "./style.css";
import ReactToPrint from "react-to-print";
import { jsPDF } from "jspdf";

const initialItems = [
  {
    id: 1,
    itemName: "Banana",
    price: 7,
    type: "food",
  },
  {
    id: 2,
    itemName: "Apple",
    price: 20,
    type: "food",
  },
  {
    id: 3,
    itemName: "Orange",
    price: 4,
    type: "food",
  },
  {
    id: 4,
    itemName: "Pear",
    price: 4,
    type: "food",
  },
  {
    id: 5,
    itemName: "Espresso",
    price: 4,
    type: "drink",
  },
];

export default function App() {
  // const [test, setTest] = useState("test");
  const [allItems, setAllItem] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(null);
  const [billItem, setBillItem] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [numPages, setNumPages] = useState < number > 0;
  const [pageNumber, setPageNumber] = useState < number > 1;

  //const [editItem, setEditItem] = useState(null);

  function isItemAddedToBill(itemId) {
    return billItem.some((item) => item.id === itemId);
  }

  function handleSearch(e) {
    e.preventDefault();
    setSearchTerm(e.target.value);
  }

  function handleSelectedItem(itemObj) {
    console.log(itemObj);
    setSelectedItem((currentSelected) =>
      currentSelected?.id === itemObj.id ? null : itemObj,
    );
  }
  function handleSubtract() {
    setQuantity((c) => c - 1);
  }
  function handleAdd() {
    setQuantity((c) => c + 1);
  }

  function handleAddItemToBill(newItemObj) {
    setBillItem((prevBillItems) => [...prevBillItems, newItemObj]); //<-recived newItem
    setQuantity(1);
    setSelectedItem(null);

    setSearchTerm("");
  }

  function handleUpdateItem(updatedItem) {
    setBillItem((prevBillItem) =>
      prevBillItem.map((item) =>
        item.id === updatedItem.id
          ? { ...item, quantity: updatedItem.quantity }
          : item,
      ),
    );
    console.log(updatedItem);
  }

  function handleDeleteItem(id) {
    setBillItem((prevBillItems) =>
      prevBillItems.filter((items) => items.id !== id),
    );
  }

  return (
    <>
      <Nav />
      <div className="main">
        <div className="leftSide">
          <h2>ALlItems</h2>
          <onDocumentLoadSuccess />

          <AllItems
            allItems={allItems}
            onSelection={handleSelectedItem}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            isItemAddedToBill={isItemAddedToBill}
          />
        </div>
        <div className="center">
          {selectedItem && (
            <SelectedItemList
              selectedItem={selectedItem}
              quantity={quantity}
              setQuantity={setQuantity}
              onSubtract={handleSubtract}
              onAdd={handleAdd}
              onAddItemToBill={handleAddItemToBill}
              onUpdateItem={handleUpdateItem}
            />
          )}
        </div>
        <div className="rightSide">
          {billItem.length > 0 ? (
            <BillItems
              selectedItem={selectedItem}
              billItem={billItem}
              onDeleteItem={handleDeleteItem}
              onSelection={handleSelectedItem}
              onUpdateItem={handleUpdateItem}
              //onAddItemToBill={handleAddItemToBill}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
function Nav() {
  return <h1>Navigation</h1>;
}
function AllItems({
  allItems,
  onSelection,
  searchTerm,
  onSearch,
  isItemAddedToBill,
}) {
  const filteredItem = allItems.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="all-items-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search item..."
        value={searchTerm}
        onChange={onSearch}
      />
      <ul className="item-list">
        {filteredItem.map((item) => (
          <Item
            item={item}
            key={item.id}
            onSelection={onSelection}
            disabled={isItemAddedToBill(item.id)}
          />
        ))}
      </ul>
      {filteredItem < 1 && <AddNewItem searchTerm={searchTerm} />}
    </div>
  );
}

function Item({ item, onSelection, disabled }) {
  return (
    <li
      className={`item-card ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && onSelection(item)}
    >
      <p className="item-name">{item.itemName}</p>
      <p className="item-price">{item.price}€</p>
    </li>
  );
}

function AddNewItem({ searchTerm }) {
  return (
    <div>
      <h2>Item {searchTerm} does not exist, add new Item?</h2>
      <button>Add new Item</button>
    </div>
  );
}

function SelectedItemList({
  selectedItem,
  onUpdateItem,
  onAdd,
  onSubtract,
  quantity,
  setQuantity,
  onAddItemToBill,
}) {
  function handleSubmit(e) {
    e.preventDefault();

    const newItemObj = {
      id: selectedItem?.id,
      itemName: selectedItem?.itemName,
      quantity,
      type: selectedItem?.type,
      price: selectedItem?.price,
    };
    onAddItemToBill(newItemObj);
    //   console.log(newItemObj);
  }
  return (
    <div className="selected-item-container">
      <table className="invoice-items">
        <thead>
          <th>ItemName</th>
          <th>Type</th>
          <th colSpan="3">setQuantity</th>
        </thead>
        <tbody>
          <tr>
            <td>{selectedItem?.itemName}</td>
            <td>{selectedItem?.type}</td>
            <td>
              <button onClick={onSubtract}>-</button>
            </td>
            <td>
              <input
                type="number"
                min="1"
                maxLength="3"
                size="5"
                placeholder="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              ></input>
            </td>
            <td>
              <button onClick={onAdd}>+</button>
            </td>
          </tr>
          <tr>
            <td colSpan="5">
              <button className="add-to-bill-btn" onClick={handleSubmit}>
                AddToBill
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BillItems({
  billItem,
  onDeleteItem,
  onSelection,
  onUpdateItem,
  selectedItem,
}) {
  const componentRef = useRef();
  const handlePrint = () => {
    if (!componentRef.current) return;

    const pdf = new jsPDF();
    pdf.text("Bill", 10, 10);
    pdf.autoTable({ html: "#bill-table" });
    pdf.save("bill.pdf");
  };
  const totalPrice = billItem.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  //   console.log(totalPrice);

  const totalFood =
    billItem
      .filter((item) => item.type === "food")
      .reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.07;

  const totalDrink =
    billItem
      .filter((item) => item.type === "drink")
      .reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.19;
  return (
    <div className="invoice-container">
      <h2 className="invoice-header">Bill</h2>
      <table className="invoice-items" id="bill-table">
        <thead>
          <th>ItemName</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Delete</th>
        </thead>

        {billItem.map((item, index) => (
          <BillItem
            selectedItem={selectedItem}
            item={item}
            key={index}
            onDeleteItem={onDeleteItem}
            billItem={billItem}
            totalDrink={totalDrink}
            totalFood={totalFood}
            onSelection={onSelection}
            onUpdateItem={onUpdateItem}
          />
        ))}
      </table>
      <div className="invoice-total">
        <span>Total Price:{totalPrice} €</span>
        <br />
        <span>VAT food:{totalFood.toFixed(2)} €</span>
        <br />
        <span>VAT drinks:{totalDrink.toFixed(2)} €</span>
        <br />
        <span>
          <label>Got some tip: </label>
          <input
            type="number"
            min={1}
            maxLength="3"
            size="7"
            placeholder="AddTipValue"
          ></input>
          €
        </span>
      </div>
      <ReactToPrint
        trigger={() => <button className="add-to-bill-btn">Print PDF</button>}
        content={() => componentRef.current}
      />
      <button className="add-to-bill-btn" onClick={handlePrint}>
        Save as PDF
      </button>
    </div>
  );
}

function BillItem({ item, onDeleteItem, onUpdateItem }) {
  const itemPrice = item.price * item.quantity;

  return (
    <>
      <tbody>
        {/* <tr className="invoice-item-row" onClick={() => onSelection(item)}> */}
        <tr className="invoice-item-row">
          <td>{item.itemName}</td>
          <td>
            <input
              type="number"
              min={1}
              maxLength="3"
              size="7"
              value={item.quantity}
              onChange={(e) =>
                onUpdateItem({ ...item, quantity: Number(e.target.value) })
              }
            ></input>
          </td>
          <td>{itemPrice}</td>
          <td>
            <button
              className="delete-button"
              onClick={() => onDeleteItem(item.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </>
  );
}
