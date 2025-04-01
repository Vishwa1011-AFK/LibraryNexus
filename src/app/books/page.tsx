import { Suspense } from 'react';
import { SiteHeader } from "@/components/site-header";
import { BooksClientContent } from "@/components/BooksClientContent";
import { Skeleton } from "@/components/ui/skeleton";

export default function BooksPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 p-4 md:p-6">
                <div className="container mx-auto">
                    <Suspense fallback={<BooksPageSkeleton />}>
                        <BooksClientContent />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}

function BooksPageSkeleton() {
     return (
         <>
              <Skeleton className="h-10 w-1/3 mb-4" />
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Skeleton className="h-10 flex-grow" />
                  <div className="flex gap-4 w-full md:w-auto">
                      <Skeleton className="h-10 w-full md:w-[180px]" />
                      <Skeleton className="h-10 w-full md:w-[180px]" />
                  </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                 {Array.from({ length: 12 }).map((_, index) => (
                      <div key={index} className="space-y-2">
                          <Skeleton className="aspect-[2/3] w-full rounded-md" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                      </div>
                 ))}
             </div>
             <div className="mt-8 flex justify-center">
                 <Skeleton className="h-9 w-64" />
             </div>
         </>
     );
 }