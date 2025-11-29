import {MdManageAccounts, MdOutlineContactSupport } from 'react-icons/md';
import { RiHome5Fill } from "react-icons/ri";
import { FaFileInvoiceDollar, FaTv } from "react-icons/fa6";
import { GoCrossReference } from "react-icons/go";
import { IoCardSharp } from "react-icons/io5";
import { GrDocumentText, GrTransaction } from "react-icons/gr";


export const navData = [
    {
        id: 1,
        link: "home",
        name: "Dashboard",
        icon: <RiHome5Fill />
    },
    {
        id: 7,
        link: "transaction",
        name: "Transaction",
        icon: <GrTransaction />
    },
    {
        id: 8,
        link: "account",
        name: "Account",
        icon: <MdManageAccounts />
    },
    {
        id: 9,
        link: "card",
        name: "Card",
        icon: <IoCardSharp />
    },
    {
        id: 11,
        link: "statement",
        name: "Statements",
        icon: <GrDocumentText />
    },
    {
        id: 12,
        link: "reserve",
        name: "Reserves",
        icon: <FaTv />
    },
    {
        id: 13,
        link: "invoice",
        name: "Invoices",
        icon: <FaFileInvoiceDollar />
    },
    {
        id: 12,
        link: "referal",
        name: "Referal",
        icon: <GoCrossReference />
    },
    {
        id: 13,
        link: "support",
        name: "Support",
        icon: <MdOutlineContactSupport />
    },
];