import React, { useState, useEffect } from 'react';
import NavBar from './navbar';
import Footer from './footer';
import './viewproduct.css';

const ViewProductPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/public/product.csv');
      const csvText = await response.text();
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      
      const parsedProducts = lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim() || '';
          return obj;
        }, {});
      });
      
      setProducts(parsedProducts);
      setFilteredProducts(parsedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = products.filter(product =>
      product['Clothes Name'].toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

//   const handleDelete = async (clothesName) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         const response = await fetch('/delete-product', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//           body: `clothesName=${encodeURIComponent(clothesName)}`
//         });

//         if (response.ok) {
//           fetchProducts(); // Refresh the list
//           alert('Product deleted successfully!');
//         } else {
//           alert('Failed to delete product');
//         }
//       } catch (error) {
//         console.error('Error deleting product:', error);
//         alert('Error deleting product');
//       }
//     }
//   };

const handleDelete = async (clothesName) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Directly update the CSV file
        const updatedProducts = products.filter(
          product => product['Clothes Name'] !== clothesName
        );
        
        // Update the CSV content
        const header = 'Clothes Name,Size,Rent Price,Picture,Description\n';
        const content = updatedProducts.map(p => 
          `${p['Clothes Name']},${p.Size},${p['Rent Price']},${p.Picture},${p.Description}`
        ).join('\n');
        
        const blob = new Blob([header + content], { type: 'text/csv' });
        const formData = new FormData();
        formData.append('file', blob, 'product.csv');

        await fetch('/update-csv', {
          method: 'POST',
          body: formData
        });

        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedProducts = products.map(p => 
        p['Clothes Name'] === editingProduct.originalName ? editingProduct : p
      );

      // Update the CSV content
      const header = 'Clothes Name,Size,Rent Price,Picture,Description\n';
      const content = updatedProducts.map(p => 
        `${p['Clothes Name']},${p.Size},${p['Rent Price']},${p.Picture},${p.Description}`
      ).join('\n');
      
      const blob = new Blob([header + content], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', blob, 'product.csv');

      await fetch('/update-csv', {
        method: 'POST',
        body: formData
      });

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditingProduct(null);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

//   const handleSaveEdit = async () => {
//     try {
//       const dataString = `${editingProduct['Clothes Name']},${editingProduct.Size},${editingProduct['Rent Price']},${editingProduct.Picture},${editingProduct.Description}`;
      
//       const response = await fetch('/edit-product', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: `originalName=${encodeURIComponent(editingProduct.originalName)}&data=${encodeURIComponent(dataString)}`
//       });

//       if (response.ok) {
//         setEditingProduct(null);
//         fetchProducts(); // Refresh the list
//         alert('Product updated successfully!');
//       } else {
//         alert('Failed to update product');
//       }
//     } catch (error) {
//       console.error('Error updating product:', error);
//       alert('Error updating product');
//     }
//   };

  return (
    <div>
      <NavBar role="admin" />
      <br /><br /><br />
      <main className="page-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Product List</h1>
            <p className="hero-description">View and manage your products</p>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by clothes name..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
          </div>
        </section>

        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>Clothes Name</th>
                <th>Size</th>
                <th>Rent Price (RM)</th>
                <th>Picture</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td>
                    {editingProduct && editingProduct['Clothes Name'] === product['Clothes Name'] ? (
                      <input
                        type="text"
                        value={editingProduct['Clothes Name']}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          'Clothes Name': e.target.value
                        })}
                      />
                    ) : (
                      product['Clothes Name']
                    )}
                  </td>
                  <td>
                    {editingProduct && editingProduct['Clothes Name'] === product['Clothes Name'] ? (
                      <input
                        type="text"
                        value={editingProduct.Size}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          Size: e.target.value
                        })}
                      />
                    ) : (
                      product.Size
                    )}
                  </td>
                  <td>
                    {editingProduct && editingProduct['Clothes Name'] === product['Clothes Name'] ? (
                      <input
                        type="number"
                        value={editingProduct['Rent Price']}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          'Rent Price': e.target.value
                        })}
                      />
                    ) : (
                      `${product['Rent Price']}`
                    )}
                  </td>
                  <td>
                    <img 
                      src={`/public/${product.Picture}`} 
                      alt={product['Clothes Name']}
                      className="table-image"
                      onError={(e) => {
                        e.target.src = '/public/placeholder.png';
                      }}
                    />
                  </td>
                  <td>
                    {editingProduct && editingProduct['Clothes Name'] === product['Clothes Name'] ? (
                      <input
                        type="text"
                        value={editingProduct.Description}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          Description: e.target.value
                        })}
                      />
                    ) : (
                      product.Description
                    )}
                  </td>
                  <td className="action-buttons">
                    {editingProduct && editingProduct['Clothes Name'] === product['Clothes Name'] ? (
                      <>
                        <button 
                          className="save-btn"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={() => setEditingProduct(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit({ ...product, originalName: product['Clothes Name'] })}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(product['Clothes Name'])}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ViewProductPage;