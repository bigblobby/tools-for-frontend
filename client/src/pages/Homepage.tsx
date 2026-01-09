import { Button } from '@/components/ui/button';
import useMostRecentPages from '@/hooks/useMostRecentPages';
import { getPageTitle } from '@/utilities/page.utilities';
import { Link } from '@tanstack/react-router';
import useMostUseTools from '@/hooks/use-most-used-tools.ts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { pageCategories } from '@/constants/page.constants.ts';
import SEO from '@/components/SEO';

export default function Homepage() {
  const recentPages = useMostRecentPages();
  const mostUsedTools = useMostUseTools();

  return (
    <>
      <SEO
        title="Tools For Frontend - Free Developer Tools & Utilities"
        description="Free online tools for frontend developers. Color pickers, converters, image optimizers, string utilities, and more."
        keywords="frontend tools, developer tools, color picker, image optimizer, string converter, json formatter, base64 encoder, free online tools"
        ogTitle="Tools For Frontend - Free Developer Tools & Utilities"
        ogDescription="Free online tools for frontend developers. Color pickers, converters, image optimizers, and more."
        canonicalUrl="https://toolsforfrontend.com/"
      />
      <div className="space-y-8">
        {
          (recentPages.length > 0 || mostUsedTools.length > 0) && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Tools for you...</h2>
              <div className="space-y-8">
                {recentPages.length > 0 && (
                  <div>
                    <h3 className="mb-2">👀 Your recent tools...</h3>
                    <ul className="flex flex-wrap gap-2">
                      {recentPages.slice().reverse().map((path: string, index: number) => (
                        <li key={index}>
                          <Button variant="secondary" size="lg" asChild>
                            <Link to={path}>{getPageTitle(path)}</Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {mostUsedTools.length > 0 && (
                  <div>
                    <h3 className="mb-2">
                      ⭐️ Your most used tools...{" "}
                      <Tooltip useTouch={true}>
                        <TooltipTrigger className="cursor-help" asChild>
                          <button className="text-xs text-blue-500">How is this tracked?</button>
                        </TooltipTrigger>
                        <TooltipContent className="w-56">
                          <p>The browser tracks page views in local storage, so we know which page you view the most. Which translates to the tool you use the most.... we hope.</p>
                        </TooltipContent>
                      </Tooltip>
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {mostUsedTools.slice(0, 5).map((path: string, index: number) => (
                        <li key={index}>
                          <Button variant="secondary" size="lg" asChild>
                            <Link to={path}>{getPageTitle(path)}</Link>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        }

        <div>
          <h2 className="text-2xl font-bold mb-2">All tools...</h2>
          <div className="space-y-8">
            {pageCategories.map((section) => {
              return (
                <div key={section.category}>
                  <h3 className="mb-2">{section.icon} Tools for {section.category.toLowerCase()}...</h3>
                  <ul className="flex flex-wrap gap-2">
                    {section.items.map((item) => (
                      <li key={item.path}>
                        <Button variant="secondary" size="lg" asChild>
                          <Link to={item.path}>{item.title}</Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}