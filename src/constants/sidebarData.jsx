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
        nameKey: "sidebar.dashboard",
        icon: <RiHome5Fill />
    },
    {
        id: 7,
        link: "transaction",
        nameKey: "sidebar.transaction",
        icon: <GrTransaction />
    },
    {
        id: 8,
        link: "account",
        nameKey: "sidebar.account",
        icon: <MdManageAccounts />
    },
    {
        id: 9,
        link: "card",
        nameKey: "sidebar.card",
        icon: <IoCardSharp />
    },
    {
        id: 11,
        link: "statement",
        nameKey: "sidebar.statements",
        icon: <GrDocumentText />
    },
    {
        id: 12,
        link: "reserve",
        nameKey: "sidebar.reserves",
        icon: <FaTv />
    },
    {
        id: 13,
        link: "invoice",
        nameKey: "sidebar.invoices",
        icon: <FaFileInvoiceDollar />
    },
    {
        id: 14,
        link: "referal",
        nameKey: "sidebar.referral",
        icon: <GoCrossReference />
    },
    {
        id: 15,
        link: "support",
        nameKey: "sidebar.support",
        icon: <MdOutlineContactSupport />
    },
];