import type { MDXComponents } from "mdx/types";
import Link from "next/link"
import Image from "next/image"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    p: ({ children }) => <p className="paragraph-widths mx-auto">{children}</p>,
    h3: ({ children }) => <h3 className="paragraph-widths mx-auto">{children}</h3>,
    a: ({ children, ...props }) => {
      return (
        <Link {...props} target="_blank" href={props.href || ''}>
          {children}
        </Link>
      )
    },
    // img: ({ children, props }) => {
    //   return <Image {...props} />
    // },
    // return components rather than overriding h1...
    ...components,
  };
}
