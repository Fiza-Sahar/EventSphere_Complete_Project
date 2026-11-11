import React, { useState } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';

const ProductsServices = () => {
  const [products, setProducts] = useState([
    { name: 'AI Flagship V2 Engine', description: 'Next-generation neural inference server platform.' },
    { name: 'Autonomous Robotics Controller', description: 'Real-time spatial awareness software suite.' }
  ]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name) return;
    setProducts([...products, { name, description }]);
    setName('');
    setDescription('');
  };

  const handleDelete = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold mb-0" style={{ color: "var(--heading-color)" }}>Products & Services Catalog</h4>
        <p className="text-muted small">Showcase products available for delegates visiting your booth.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="glass-card p-4">
            <h5 className="fw-bold  mb-3" style={{ color: "var(--heading-color)" }}>Add Product / Service</h5>
            <form onSubmit={handleAdd} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small fw-bold">Product Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-control" placeholder="e.g. Enterprise Cloud Suite" />
              </div>
              <div>
                <label className="form-label small fw-bold">Description</label>
                <textarea rows="3" required value={description} onChange={e => setDescription(e.target.value)} className="form-control" placeholder="Brief feature summary..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary-custom py-2 fw-bold d-flex align-items-center justify-content-center gap-2">
                <Plus size={18} /> Add to Catalog
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="glass-card p-4">
            <h5 className="fw-bold  mb-3" style={{ color: "var(--heading-color)" }}>Active Catalog Items ({products.length})</h5>
            <div className="d-flex flex-column gap-3">
              {products.map((p, idx) => (
                <div key={idx} className="p-3 rounded border border-secondary d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-bold  mb-1" style={{ color: "var(--heading-color)" }}>{p.name}</div>
                    <div className="text-muted small">{p.description}</div>
                  </div>
                  <button onClick={() => handleDelete(idx)} className="btn btn-sm btn-link text-danger p-0 ms-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsServices;
