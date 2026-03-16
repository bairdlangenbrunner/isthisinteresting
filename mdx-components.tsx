import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    p: ({ children }) => <p className="paragraph-widths mx-auto">{children}</p>,
    h3: ({ children }) => (
      <h3 className="paragraph-widths mx-auto">{children}</h3>
    ),
    // h4: ({ children }) => (
    //   <h4 className="paragraph-widths mx-auto">{children}</h4>
    // ),
    // div: ({ children }) => <div className="display-block mx-auto">{children}</div>,

    a: ({ children, href, ...props }) => {
      const resolvedHref = href || "";
      const isInternalLink =
        resolvedHref.startsWith("/") || resolvedHref.startsWith("#");

      if (isInternalLink) {
        return (
          <Link href={resolvedHref} {...props}>
            {children}
          </Link>
        );
      }

      return (
        <a
          {...props}
          href={resolvedHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },

    // Tweet: ({children}) => <div className="paragraph-widths mx-auto"><Tweet>{children}</Tweet></div>,
    // img: ({ children, props }) => {
    //   return <Image {...props} />
    // },
    // return components rather than overriding h1...

    // code: ({children}) => <div className="bg-stone-200 p-[1rem] rounded-lg">{children}</div>,

    ...components,
  };
}
