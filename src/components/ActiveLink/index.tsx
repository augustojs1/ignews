import Link, { LinkProps } from "next/link";
import { ReactElement, cloneElement } from "react";
import { useRouter } from "next/router";

// Estendemos para o LinkProps para que assim nosso componente aceite receber as mesmas props que um elemento Link receberia.
interface ActiveLinkProps extends LinkProps {
  // Esse componente pode receber um componente html/react como filho.
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({
  children,
  activeClassName,
  ...rest
}: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === rest.href ? activeClassName : "";

  return <Link {...rest}>{cloneElement(children, { className })}</Link>;
}
