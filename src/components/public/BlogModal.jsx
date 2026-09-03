export default function BlogModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] flex flex-col relative p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold cursor-pointer">&times;</button>
        
        <h2 className="text-base font-extrabold text-primary mb-3">{product.title} - Health Guide</h2>
        
        <div className="flex-1 overflow-y-auto text-xs text-gray-700 leading-relaxed pr-2" dangerouslySetInnerHTML={{ __html: product.blogHtml }} />

        <div className="mt-4 pt-3 border-t border-gray-100">
          <button 
            onClick={() => { onAddToCart(product.title, product.sizes[0].size, product.sizes[0].sale); onClose(); }} 
            className="w-full bg-primary text-white font-bold py-2 rounded text-xs cursor-pointer hover:bg-primary-dark"
          >
            Order Now - Cash on Delivery
          </button>
        </div>
      </div>
    </div>
  );
}