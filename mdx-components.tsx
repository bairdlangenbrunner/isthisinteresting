import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h3: ({ children }) => <h3 className='h3-post'>{children}</h3>,
    // Image: ({ children }) => <Image className='image-widths'>{children}></Image>,
    ...components, // return components rather than overriding h1...
  };
}
