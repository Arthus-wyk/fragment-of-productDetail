// import { BGShapeCircle } from "@/components/bg-shape-circle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {

  return (
    <div className=" relative">
      <div className="absolute z-0 inset-0 top-0 bottom-0 left-0 right-0 grayscale"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6 drop-shadow-md">
            A Generator Of Product Detail
          </h2>
          <p className="text-center px-20 text-xl sm:text-xl text-gray-300 text-muted-foreground mb-8 whitespace-pre-line">
           { `Welcome to our cutting-edge platform designed to revolutionize the way you present product details.\n
            Our tool automatically generates rich, SEO-optimized product pages that cater to every need.
            From concise descriptions to detailed specifications, we combine the power of AI and machine learning to curate personalized, engaging content that resonates with your target audience. Our generator simplifies the process, saving you time and effort, while ensuring consistency and accuracy across all your product pages.
            Ready to streamline your product listing process? Start generating detailed, custom-tailored product pages today!`}
          </p>
          <div className="flex flex-row justify-center gap-4">

            <Link key='start' href='/web-generator' target="_blank">
              <Button
                key='start'
                size="lg"
                variant="default"
              >
                Start Now!
              </Button>
            </Link>
          </div>

        </div>
        <img
          alt='main image'
          src='https://image1.juramaia.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250117163959.png'
          className="mt-8 max-w-full md:max-w-5xl mx-auto rounded-md shadow-2xl border sm:mt-12 block dark:hidden"
        />

      </div>
    </div>
  );
}
