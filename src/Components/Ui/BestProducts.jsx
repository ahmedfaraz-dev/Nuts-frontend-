import { useNavigate } from 'react-router-dom'
import bg from '../../assets/bgimage.png'
import Button from './Button'

const BestProducts = ({ heading, subheading, imageSrc }) => {
  const navigate = useNavigate()
  return (
    <div
      className="relative w-[520px] h-[250px] rounded-2xl bg-center bg-cover pt-10 pl-9 overflow-hidden flex-shrink-0 shadow-md hover:shadow-xl transition-shadow duration-300"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Content Side */}
      <div className="w-[240px] h-[178px] relative z-10 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white leading-tight line-clamp-2">{heading}</h1>
          <p className="text-sm text-white/90 pt-3 leading-relaxed line-clamp-2">
            {subheading}
          </p>
        </div>
        <div>
          <Button onClick={() => navigate('/all-products')}>Shop Now</Button>
        </div>
      </div>

      {/* Image Side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[240px] h-[200px] flex items-center justify-center">
        <img
          src={imageSrc}
          alt={heading}
          className="max-w-full max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  )
}

export default BestProducts
