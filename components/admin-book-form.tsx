"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type Book } from '@/types';
import { ArrowLeft } from 'lucide-react';

const bookFormSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    author: z.string().min(1, { message: "Author is required" }),
    isbn: z.string().min(10, { message: "ISBN must be at least 10 characters" }),
    publishDate: z.string().min(1, { message: "Publish date is required" }),
    pages: z.coerce.number().min(1, { message: "Pages must be at least 1" }),
    language: z.string().min(1, { message: "Language is required" }),
    location: z.string().min(1, { message: "Location/Shelf is required" }),
    totalCopies: z.coerce.number().min(0, { message: "Total copies cannot be negative" }),
    cover: z.string().url({ message: "Please enter a valid URL for cover image" }).optional().or(z.literal('')),
    publisher: z.string().optional(),
    category: z.string().optional(),
    featured: z.boolean().default(false),
    description: z.string().optional(),
});

type BookFormData = z.infer<typeof bookFormSchema>;

interface AdminBookFormProps {
    initialData?: Book | null;
    mode: 'add' | 'edit';
}

export function AdminBookForm({ initialData, mode }: AdminBookFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<BookFormData>({
        resolver: zodResolver(bookFormSchema),
        defaultValues: {
            title: initialData?.title || '',
            author: initialData?.author || '',
            isbn: initialData?.isbn || '',
            publishDate: initialData?.publishDate || '',
            pages: initialData?.pages || 0,
            cover: initialData?.coverUrl || initialData?.cover || '',
            language: initialData?.language || '',
            location: initialData?.location || initialData?.shelf || '',
            publisher: initialData?.publisher || '',
            category: initialData?.category || '',
            featured: initialData?.featured || false,
            description: initialData?.description || '',
            totalCopies: initialData?.totalCopies || 1,
        },
    });

    useEffect(() => {
        reset({
            title: initialData?.title || '',
            author: initialData?.author || '',
            isbn: initialData?.isbn || '',
            publishDate: initialData?.publishDate || '',
            pages: initialData?.pages || 0,
            cover: initialData?.coverUrl || initialData?.cover || '',
            language: initialData?.language || '',
            location: initialData?.location || initialData?.shelf || '',
            publisher: initialData?.publisher || '',
            category: initialData?.category || '',
            featured: initialData?.featured || false,
            description: initialData?.description || '',
            totalCopies: initialData?.totalCopies || 1,
        });
    }, [initialData, reset]);

    const onSubmit: SubmitHandler<BookFormData> = async (data) => {
        setIsLoading(true);
        try {
            let response;
            const payload = { ...data };

            if (mode === 'edit' && initialData?.id) {
                response = await apiClient(`/api/admin/books/${initialData.id}`, 'PUT', payload);
                toast({ title: "Success", description: `Book "${data.title}" updated successfully.` });
                router.push(`/admin/books/${initialData.id}`);
                router.refresh();
            } else {
                response = await apiClient('/api/admin/books', 'POST', payload);
                toast({ title: "Success", description: `Book "${data.title}" added successfully.` });
                router.push('/admin');
                router.refresh();
            }
        } catch (err: any) {
            toast({
                title: `Error ${mode === 'edit' ? 'Updating' : 'Adding'} Book`,
                description: err.message || `Failed to ${mode === 'edit' ? 'update' : 'add'} book.`,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 max-w-3xl py-8">
             <div className="mb-6">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4"/> Cancel
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{mode === 'edit' ? 'Edit Book Details' : 'Add New Book'}</CardTitle>
                    <CardDescription>
                        {mode === 'edit' ? `Modify the details for "${initialData?.title}"` : 'Fill in the details for the new book.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                                <Input id="title" {...register("title")} placeholder="Enter book title" disabled={isLoading} />
                                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="author">Author <span className="text-destructive">*</span></Label>
                                <Input id="author" {...register("author")} placeholder="Enter author name" disabled={isLoading} />
                                {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="isbn">ISBN <span className="text-destructive">*</span></Label>
                                <Input id="isbn" {...register("isbn")} placeholder="Enter ISBN" disabled={isLoading} />
                                {errors.isbn && <p className="text-sm text-destructive">{errors.isbn.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="publishDate">Publish Date <span className="text-destructive">*</span></Label>
                                <Input id="publishDate" {...register("publishDate")} placeholder="e.g., 2023-09-15 or Sep 15, 2023" type="text" disabled={isLoading} />
                                {errors.publishDate && <p className="text-sm text-destructive">{errors.publishDate.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pages">Pages <span className="text-destructive">*</span></Label>
                                <Input id="pages" type="number" {...register("pages")} placeholder="Enter number of pages" disabled={isLoading} />
                                {errors.pages && <p className="text-sm text-destructive">{errors.pages.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="language">Language <span className="text-destructive">*</span></Label>
                                <Input id="language" {...register("language")} placeholder="e.g., English" disabled={isLoading} />
                                {errors.language && <p className="text-sm text-destructive">{errors.language.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location/Shelf <span className="text-destructive">*</span></Label>
                                <Input id="location" {...register("location")} placeholder="e.g., Shelf 3A, Row 2" disabled={isLoading} />
                                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="totalCopies">Total Copies <span className="text-destructive">*</span></Label>
                                <Input id="totalCopies" type="number" {...register("totalCopies")} placeholder="Enter total copies" disabled={isLoading} />
                                {errors.totalCopies && <p className="text-sm text-destructive">{errors.totalCopies.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" {...register("category")} placeholder="e.g., Fiction, Science" disabled={isLoading} />
                                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="publisher">Publisher</Label>
                                <Input id="publisher" {...register("publisher")} placeholder="Enter publisher name" disabled={isLoading} />
                                {errors.publisher && <p className="text-sm text-destructive">{errors.publisher.message}</p>}
                            </div>
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="cover">Cover Image URL</Label>
                            <Input id="cover" {...register("cover")} placeholder="https://example.com/image.jpg" disabled={isLoading} />
                            {errors.cover && <p className="text-sm text-destructive">{errors.cover.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...register("description")} placeholder="Enter book description (optional)" rows={4} disabled={isLoading} />
                            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="featured" {...register("featured")} disabled={isLoading} />
                            <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Mark as Featured Book
                            </Label>
                        </div>

                        <div className="flex justify-end pt-4">
                             <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                                {isLoading ? (mode === 'edit' ? 'Updating...' : 'Adding...') : (mode === 'edit' ? 'Save Changes' : 'Add Book')}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}