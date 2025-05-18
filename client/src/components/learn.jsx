// "use client";

// import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
// import image1 from "../assets/image1.jpg";
// import irrigation from "../assets/image2.jpg";
// import cropRotation from "../assets/image3.jpg";
// import equipment from "../assets/image4.jpg";
// import soil from "../assets/image5.jpg";

// const features = [
//   {
//     name: "Organic Farming",
//     description:
//       "Learn how to grow crops without synthetic fertilizers or pesticides, ensuring healthier food and sustainable practices.",
//     image: image1,
//     className: "col-span-3 lg:col-span-2",
//   },
//   {
//     name: "Irrigation Techniques",
//     description:
//       "Understand modern and traditional irrigation methods like drip, sprinkler, and furrow systems.",
//     image: irrigation,
//     className: "col-span-3 lg:col-span-1",
//   },
//   {
//     name: "Crop Rotation",
//     description:
//       "Learn how alternating crops helps improve soil fertility and reduce pests and diseases.",
//     image: cropRotation,
//     className: "col-span-3 lg:col-span-1",
//   },
//   {
//     name: "Farm Equipment",
//     description:
//       "Get to know essential agricultural tools and machinery that simplify and improve farming.",
//     image: equipment,
//     className: "col-span-3 lg:col-span-2",
//   },
//   {
//     name: "Soil Health & Fertility",
//     description:
//       "Explore how to assess and improve soil quality through natural and scientific approaches.",
//     image: soil,
//     className: "col-span-3 lg:col-span-1",
//   },
// ];

// export default function Learn() {
//   return (
//     <section className="mt-4 px-6 py-16 max-w-7xl mx-auto bg-gradient-to-b from-green-50 to-white">
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-extrabold text-green-900 tracking-wide">
//           Learn About Agriculture
//         </h1>
//         <p className="mt-4 text-green-800 text-base max-w-2xl mx-auto leading-relaxed">
//           Dive into essential farming topics like irrigation, organic
//           techniques, crop rotation, and modern equipment.
//         </p>
//       </div>

//       <BentoGrid>
//         {features.map((feature, idx) => (
//           <BentoCard
//             key={idx}
//             name={feature.name}
//             description={feature.description}
//             className={`${feature.className} group cursor-pointer`} // add pointer cursor
//             background={
//               <div
//                 className="flex flex-col rounded-xl overflow-hidden shadow-lg
//                            h-[400px] relative bg-gradient-to-b from-white to-green-50 border border-green-200
//                            hover:shadow-2xl transition-shadow duration-300"
//               >
//                 {/* Image (2/3 height) */}
//                 <img
//                   src={feature.image}
//                   alt={feature.name}
//                   className="w-full h-2/3 object-cover"
//                   loading="lazy"
//                 />

//                 {/* Text container (1/3 height) */}
//                 <div
//                   className="p-2 bg-white flex flex-col justify-center
//                              transition-transform duration-300 ease-in-out
//                              group-hover:-translate-y-4"
//                   style={{ maxHeight: "33%" }}
//                 >
//                   <h3 className="text-lg font-semibold text-green-900 mb-1 tracking-wide">
//                     {feature.name}
//                   </h3>
//                   <p className="text-green-800 text-sm leading-tight line-clamp-5">
//                     {feature.description}
//                   </p>
//                 </div>
//               </div>
//             }
//           />
//         ))}
//       </BentoGrid>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Skeleton } from "@/components/ui/skeleton";
import image1 from "../assets/image1.jpg";
import irrigation from "../assets/image2.jpg";
import cropRotation from "../assets/image3.jpg";
import equipment from "../assets/image4.jpg";
import soil from "../assets/image5.jpg";

const features = [
  {
    name: "Organic Farming",
    description:
      "Learn how to grow crops without synthetic fertilizers or pesticides, ensuring healthier food and sustainable practices.",
    image: image1,
    className: "col-span-3 lg:col-span-2",
  },
  {
    name: "Irrigation Techniques",
    description:
      "Understand modern and traditional irrigation methods like drip, sprinkler, and furrow systems.",
    image: irrigation,
    className: "col-span-3 lg:col-span-1",
  },
  {
    name: "Crop Rotation",
    description:
      "Learn how alternating crops helps improve soil fertility and reduce pests and diseases.",
    image: cropRotation,
    className: "col-span-3 lg:col-span-1",
  },
  {
    name: "Farm Equipment",
    description:
      "Get to know essential agricultural tools and machinery that simplify and improve farming.",
    image: equipment,
    className: "col-span-3 lg:col-span-2",
  },
  {
    name: "Soil Health & Fertility",
    description:
      "Explore how to assess and improve soil quality through natural and scientific approaches.",
    image: soil,
    className: "col-span-3 lg:col-span-1",
  },
];

export default function Learn() {
  const [loadedImages, setLoadedImages] = useState(Array(features.length).fill(false));

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  return (
    <section className="mt-4 px-6 py-16 max-w-7xl mx-auto bg-gradient-to-b from-green-50 to-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-green-900 tracking-wide">
          Learn About Agriculture
        </h1>
        <p className="mt-4 text-green-800 text-base max-w-2xl mx-auto leading-relaxed">
          Dive into essential farming topics like irrigation, organic
          techniques, crop rotation, and modern equipment.
        </p>
      </div>

      <BentoGrid>
        {features.map((feature, idx) => (
          <BentoCard
            key={idx}
            name={feature.name}
            description={feature.description}
            className={`${feature.className} group cursor-pointer`}
            background={
              <div
                className="flex flex-col rounded-xl overflow-hidden shadow-lg
                  h-[400px] relative bg-gradient-to-b from-white to-green-50 border border-green-200
                  hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Skeleton shown only while image is loading */}
                {!loadedImages[idx] && (
                  <Skeleton className="w-full h-2/3 absolute top-0 left-0 z-10" />
                )}

                {/* Image always rendered but hidden with opacity until loaded */}
                <img
                  src={feature.image}
                  alt={feature.name}
                  className={`w-full h-2/3 object-cover transition-opacity duration-500 ${
                    loadedImages[idx] ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  onLoad={() => handleImageLoad(idx)}
                />

                {/* Text container */}
                <div
                  className="p-2 bg-white flex flex-col justify-center
                             transition-transform duration-300 ease-in-out
                             group-hover:-translate-y-4"
                  style={{ maxHeight: "33%" }}
                >
                  <h3 className="text-lg font-semibold text-green-900 mb-1 tracking-wide">
                    {feature.name}
                  </h3>
                  <p className="text-green-800 text-sm leading-tight line-clamp-5">
                    {feature.description}
                  </p>
                </div>
              </div>
            }
          />
        ))}
      </BentoGrid>
    </section>
  );
}
