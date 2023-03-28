import "./GlobalStyle.scss";

type ChildrenProps = {
    children: JSX.Element 
}

function GlobalStyle({ children }: ChildrenProps) {
    return children;
}

export default GlobalStyle;