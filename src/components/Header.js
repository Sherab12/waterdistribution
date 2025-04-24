import Link from "next/link";
import styled from "styled-components";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CartContext } from "./CartContext";
import { FiShoppingCart } from "react-icons/fi";

const StyledHeader = styled.header`
    background-color: #fff;
    padding: 10px 0;
    border-bottom: 2px solid #fff;
    position: fixed;
    width: 100%;
    top: ${({ isVisible }) => (isVisible ? "0" : "-80px")};
    transition: top 0.3s ease-in-out;
    z-index: 1000;
`;

const StyledDiv = styled.div`
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 27px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled(Link)`
    display: flex;
    align-items: center;
    text-decoration: none;
    img {
        height: 40px;
        width: 40px;
        margin-right: -5px;
        margin-left: -10px;
    }
`;

const Gyen = styled.p`
    font-family: sans-serif;
    font-weight: bold;
    font-size: 12px;
    color: black;
    width: 70px;
    margin-top: 27px;
    margin-right: 20px;
    text-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
`;

const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const StyledNav = styled.nav`
    display: flex;
    margin-top: 17px;
    margin-left: -25px;
    gap: 20px;
`;

const RightNav = styled.div`
    display: flex;
    margin-bottom: -17px;
    gap: 25px;
    align-items: center;
`;

const NavLink = styled(Link)`
    color: ${({ active }) => (active ? "#FF8A2A" : "black")};
    text-decoration: none;
    font-weight: 500;
    position: relative;
    padding-bottom: 5px;

    &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: -3px;
        width: ${({ active }) => (active ? "100%" : "0")};
        height: 3px;
        background-color: ${({ active }) => (active ? "#FF8A2A" : "transparent")};
        transition: width 0.3s ease-in-out;
    }

    &:hover {
        color: #FF8A2A;
    }
    &:hover::after {
        width: 100%;
        background-color: #FF8A2A;
    }
`;

const CartButton = styled(Link)`
    position: relative;
    display: flex;
    align-items: center;
    color: ${({ active }) => (active ? "#FF8A2A" : "black")}; /* Active state color */
    text-decoration: none;
    font-size: 20px;
    transition: color 0.3s ease;

    &:hover {
        color: #FF8A2A; /* Change color on hover */
    }

    span {
        position: absolute;
        top: -5px;
        right: -10px;
        background-color: red;
        color: white;
        border-radius: 50%;
        font-size: 12px;
        padding: 3px 6px;
    }
`;



const CreateAccountButton = styled(Link)`
    background-color: #FF8A2A;
    color: white;
    padding: 8px 15px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.3s ease, transform 0.2s ease;
    &:hover {
        background-color: rgb(255, 115, 0);
        transform: scale(1.05);
    }
`;

export default function Header() {
    const { cartProducts } = useContext(CartContext);
    const router = useRouter();

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < lastScrollY || window.scrollY < 50) {
                setIsVisible(true); // Show header when scrolling up or at top
            } else {
                setIsVisible(false); // Hide when scrolling down
            }
            setLastScrollY(window.scrollY);
        };

        const handleMouseMove = (e) => {
            if (e.clientY < 80) setIsVisible(true); // Show header when mouse is at top
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [lastScrollY]);

    return (
        <StyledHeader isVisible={isVisible}>
            <StyledDiv>
                <Logo href={"/"}>
                    <img src="/image/final.svg" alt="Tap Tap Logo" />
                    <Gyen>Tap Tap</Gyen>
                </Logo>

                <NavContainer>
                    <StyledNav>
                        <NavLink href={"/"} active={router.pathname === "/"}>Home</NavLink>
                        <NavLink href={"/products"} active={router.pathname === "/products" || router.pathname.startsWith("/product")}>Shop</NavLink>
                        <NavLink href={"/compatible"} active={router.pathname === "/compatible"}>Compatible Phones</NavLink>
                        <NavLink href={"/about"} active={router.pathname === "/about"}>About Tap Tap</NavLink>
                    </StyledNav>
                    <RightNav>
                    <CartButton href={"/cart"} active={router.pathname === "/cart"}>
                        <FiShoppingCart />
                        {cartProducts.length > 0 && <span>{cartProducts.length}</span>}
                    </CartButton>

                        <NavLink href={"/signin"} active={router.pathname === "/signin"}>Sign in</NavLink>
                        <CreateAccountButton href={"/signin"}>Create Free Account</CreateAccountButton>
                    </RightNav>
                </NavContainer>
            </StyledDiv>
        </StyledHeader>
    );
}
