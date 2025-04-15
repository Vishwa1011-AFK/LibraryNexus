"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  const router = useRouter()
  const imageUrl = "https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"

  return (
    <section className="bg-gradient-to-br from-slate-100 to-slate-200 font-sans min-h-screen flex items-center justify-center p-4">
      <div className="container mx-auto max-w-6xl"> 
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-3 gap-8"> 
            <div className="md:col-span-2 flex items-center justify-center p-6 md:p-8 bg-slate-50">
              <Image
                src={imageUrl}
                alt="Animated illustration showing a lost page connection"
                width={800}
                height={600}
                className="max-w-[800px] w-full h-auto object-contain" 
                priority
                unoptimized={true}
              />
            </div>
            <div className="md:col-span-1 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-emerald-600 mb-4 tracking-tight">
                404
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-3">
                Oops! Page Not Found.
              </h2>
              <p className="text-slate-600 mb-8 text-base sm:text-lg">
                It seems the page you're looking for has wandered off the shelf or doesn't exist in our library.
              </p>
              <div className="flex justify-center md:justify-start">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => router.push("/")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Go Back Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}