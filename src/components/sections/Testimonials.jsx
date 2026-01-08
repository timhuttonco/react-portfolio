import React from "react";
import Slider from "react-slick";
import Pagetitle from "../elements/Pagetitle";
import Testimonial from "../elements/Testimonial";

const sliderData = [
  {
    id: 1,
    avatar: "images/gianfranco.png",
    userName: "Gianfranco Franzella",
    subtitle: "Implementations Team Lead at Decibel",
    review:
      "I had the great opportunity to work with Tim as my Lead Solution Engineer at Decibel. He has the kindest and most patient way of teaching everything that he knows. He was the busiest person in the company but always had time for helping out and sharing his knowledge. His dedication and passion for the workplace were unquestionable. One of the few great bosses that I ever had.",
  },
  {
    id: 2,
    avatar: "images/alex.png",
    userName: "Alex Gold",
    subtitle: "Customer Success Director at Decibel",
    review:
      "Tim's experience but also his approach to teamwork and an unwavering calm demeanour makes him a rare find. Supportive, knowledgeable, understanding and extremely well liked by both colleagues and customers - he is a pleasure to work with and learn from. Being able to provide my customers with the right answers and additional support across implementation and delivery is key to driving success. Tim was always willing to help and do whatever it took to get the job done. He was extremely well-liked by our customers who always commented on his thorough advice, extreme breadth of knowledge but also, almost as important, they absolutely loved working with him!",
  },
  {
    id: 3,
    avatar: "images/chris.png",
    userName: "Chris Holsman",
    subtitle: "Founder at CN English",
    review:
      "Tim did an excellent job updating and transforming my website. He worked quickly and efficiently and had my site live in no time at all. He kept in touch every step of the way and I am very pleased with the result.",
  },
  {
    id: 4,
    avatar: "images/joseph.png",
    userName: "Joseph Barker",
    subtitle: "Implementation Team Lead at Decibel",
    review:
      "I have been very lucky to work alongside Tim for around three years at Decibel! From building up our Service Delivery processes and being a major contributor to us growing from a company of 25 to around 200, he helped scale our team for success working with our largest clients and training up our team. Tim has been one of the most Technically Skilled and hard working members of our international team.",
  }
];

function Testimonials() {
  const slidetSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section id="testimonials">
      <div className="container">
        <Pagetitle title="Testimonials" />
        <Slider {...slidetSettings} className="testimonials-wrapper">
          {sliderData.map((slider) => (
            <Testimonial key={slider.id} slider={slider} />
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default Testimonials;
