// import Order from '../models/Order.js';

// export const createOrder = async (req, res) => {
//   const { user, items, amount } = req.body;

//   const newOrder = new Order({ user, items, amount });

//   try {
//     const savedOrder = await newOrder.save();
//     res.status(201).json(savedOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };







































// export default Banner;...........................//..........................         import React from 'react';
// import './home.css';

// const Card = (props) => {
//   return (
//     <div className='cards-card'>
//       <h5>{props.name}</h5>
//       <div className='img-container'>
//         <a href="" >
//           <img src={"images/" + props.img + ".jpg"} alt={props.img}></img>
//         </a>
//       </div>
//       <a href="" className='bottom-link'>
//         {props.bottom}
//       </a>
//     </div>
//   )
// }

// export default Card;.....................//...................................   import React from 'react';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

// import Card from './Card';
// import MultiCard from './MultiCard';
// import './home.css';

// const Cards = () => {
//   return (
//     <div className='cards-section'>
//       <div className='cards-container container-fluid'>
//         <div className='row cards'>
//           <div className='col-6 col-sm-4 col-xl-3 multi-card'>
//             <MultiCard name="Shop by Category" img="category-1" a="Smartwatches" b="Tablets" c="Laptops" d="Monitors" bottom="See more" />
//           </div>
//           <div className='col-6 col-sm-4 col-xl-3'>
//             <Card name="Health and Personal Care" img="category-2" bottom="Shop now" />
//           </div>
//           <div className='col-6 col-sm-4 col-xl-3'>
//             <Card name="Get Fit at Home" img="category-3" bottom="Explore now" />
//           </div>
//           <div className='col-6 col-sm-4 col-xl-3'>
//             <Card name="Shop Mother's Day Gifts" img="category-4" bottom="Shop now" />
//           </div>
//           <div className='col-6 col-sm-4 col-xl-3'>
//             <Card name="Computer & Accessories" img="category-5" bottom="Shop now" />
//           </div>
//           <div className='col-6 col-sm-4 col-xl-3'>
//             <Card name="Beauty Picks" img="category-6" bottom="Shop now" />
//           </div>
//           <div className='col-6 col-sm-4 col-xl-3 multi-card'>
//             <MultiCard name="Tools for Daily Use" img="category-7" a="Machinery" b="Equipments" c="Accessories" d="Medical Kits" bottom="See more" />
//           </div>
//           <div className='col-6 col-sm-4 col-xl-3'>
//             <Card name="Electronics" img="category-8" bottom="Shop more" />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Cards;..............................//// src/pages/Home.jsx
// import React from 'react';

// const Home = () => {
//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>Welcome to the Home Page 🎉</h1>
//       <p>You have successfully logged in.</p>
//     </div>
//   );
// };

// export default Home;
// .......//..................import React from 'react';
// import './home.css';

// const MultiCard = (props) => {
//   return (
//     <div className='cards-card'>
//       <h5>{props.name}</h5>
//       <div className="row">
//         <div className="col-6">
//           <div className='multi-img-container'>
//             <a href="" >
//               <img src={"images/" + props.img + "-a.jpg"} alt={props.img}></img>
//             </a>
//           </div>
//           <span>{props.a}</span>
//         </div>
//         <div className="col-6">
//           <div className='multi-img-container'>
//             <a href="" >
//               <img src={"images/" + props.img + "-b.jpg"} alt={props.img}></img>
//             </a>
//           </div>
//           <span>{props.b}</span>
//         </div>
//         <div className="col-6">
//           <div className='multi-img-container'>
//             <a href="" >
//               <img src={"images/" + props.img + "-c.jpg"} alt={props.img}></img>
//             </a>
//           </div>
//           <span>{props.c}</span>
//         </div>
//         <div className="col-6">
//           <div className='multi-img-container'>
//             <a href="" >
//               <img src={"images/" + props.img + "-d.jpg"} alt={props.img}></img>
//             </a>
//           </div>
//           <span>{props.d}</span>
//         </div>
//       </div>
//       <a href="" className='bottom-link'>
//         {props.bottom}
//       </a>
//     </div>
//   )
// }

// export default MultiCard;....................////import React from 'react';
// import './home.css';
// import Loader from '../loader/Loader';
// import { NavLink } from 'react-router-dom';

// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { Pagination, Navigation } from 'swiper/modules';

// const Slider = ({ title, link_text, arrFrom, arrTo, class: sliderClass, products, isLoading }) => {
//   return (
//     <div className='slider'>
//       <div className='slider-heading'>
//         <h5>{title}</h5>
//         <NavLink to="#">{link_text}</NavLink>
//       </div>

//       {
//         isLoading ? (
//           <div className='slider' style={{ height: '332px' }}>
//             <Loader />
//           </div>
//         ) : (
//           <Swiper
//             slidesPerView='auto'
//             spaceBetween={10}
//             slidesPerGroupAuto={true}
//             navigation={true}
//             modules={[Pagination, Navigation]}
//             className={sliderClass}
//           >
//             {
//               Array.isArray(products) &&
//               products.slice(arrFrom, arrTo).map((product) => (
//                 <SwiperSlide className='swiper-slide' key={product.id}>
//                   <NavLink to={`product/${product.id}`}>
//                     <div className='swiper-slide-img-wrapper'>
//                       <img src={product.url} className="swiper-slide-img" alt={product.url} />
//                     </div>
//                     <p>{product.price}</p>
//                   </NavLink>
//                 </SwiperSlide>
//               ))
//             }
//           </Swiper>
//         )
//       }
//     </div>
//   );
// };

// export default Slider;
                            