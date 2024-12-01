import { useState } from "react";
import * as Icons from "react-icons/bs";

export default function SidebarItems({ item }) {
    const [open, setOpen] = useState(false);

    const IconComponent = Icons[item.icon];

    if (item.childrens) {
        return (
            <div className={open ? "sidebaritems open" : "sidebaritems"}>
                <div className="sidebartitle">
                    <span>
                        {IconComponent && <i className="icon"><IconComponent /></i>}
                        {item.title}
                    </span>
                    <i className="icon toggle-btn" onClick={() => setOpen(!open)}><Icons.BsChevronDown /></i>
                </div>
                <div className="sidebarsubmenu">
                    {item.childrens.map((child, index) => <SidebarItems key={index} item={child} />)}
                </div>
            </div>
        );
    } else {
        const ChildIconComponent = Icons[item.icon];
        return (
            <a href={item.path || "#"} className="sidebaritems plain">
                {ChildIconComponent && <i className="icon"><ChildIconComponent /></i>}
                {item.title}
            </a>
        );
    }
}
