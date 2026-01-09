import SEO from '@/components/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="404 - Page Not Found - Tools For Frontend"
        description="The page you're looking for doesn't exist. Return to the homepage to browse all available tools."
        ogTitle="404 - Page Not Found"
        ogDescription="The page you're looking for doesn't exist."
      />
      <div>NotFoundPage</div>
    </>
  );
}