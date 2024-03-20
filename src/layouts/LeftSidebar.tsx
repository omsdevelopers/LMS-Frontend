import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';

import { getMenuItems } from '../helpers/menu';

// components
import Scrollbar from '../components/Scrollbar';

import AppMenu from './Menu';

// images
import profileImg from '../assets/images/users/avatar-1.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeadCount, setLeadCount } from '../redux/leads/actions';
import { RootState } from '../redux/store';
import { fetchEveryLeadCount, fetchScheduleLeadCount } from '../redux/actions';

/* user box */
const UserBox = () => {
    // get the profilemenu
    const ProfileMenus = [
        {
            label: 'My Account',
            icon: 'user',
            redirectTo: '/pages/profile',
        },
        {
            label: 'Settings',
            icon: 'settings',
            redirectTo: '/',
        },
        {
            label: 'Support',
            icon: 'help-circle',
            redirectTo: '/',
        },
        {
            label: 'Lock Screen',
            icon: 'lock',
            redirectTo: '/auth/lock-screen',
        },
        {
            label: 'Logout',
            icon: 'log-out',
            redirectTo: '/auth/logout',
        },
    ];

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    /*
     * toggle dropdown
     */
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="user-box text-center">
            <img src={profileImg} alt="" title="Mat Helme" className="rounded-circle avatar-md" />
            <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
                <Dropdown.Toggle
                    id="dropdown-notification"
                    as="a"
                    onClick={toggleDropdown}
                    className="cursor-pointer text-dark h5 mt-2 mb-1 d-block">
                    Nik Patel
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-pro-dropdown m-0">
                    {/* <div onClick={toggleDropdown}> */}
                    {(ProfileMenus || []).map((item, index) => {
                        return (
                            <React.Fragment key={index + '-profile-menu'}>
                                {index === ProfileMenus.length - 1 && <div className="dropdown-divider"></div>}
                                <Link to={item.redirectTo} className="dropdown-item notify-item">
                                    <FeatherIcon icon={item.icon} className="icon-dual icon-xs me-1" />
                                    <span>{item.label}</span>
                                </Link>
                            </React.Fragment>
                        );
                    })}
                    {/* </div> */}
                </Dropdown.Menu>
            </Dropdown>
            <p className="text-muted">Admin Head</p>
        </div>
    );
};

/* sidebar content */
const SideBarContent = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLeadCount());
        dispatch(fetchScheduleLeadCount());
        dispatch(fetchEveryLeadCount());
    }, [dispatch]);

    const leadsState = useSelector((state: RootState) => state.leadsReducer?.leadsCount);
    const scheduleLeadsState = useSelector((state: RootState) => state.leadsScheduleReducer?.leadsCount);
    const everyLeadsState = useSelector((state: RootState) => state.everyLeadsReducer?.leadsCount);

    const [leadCount, setLeadCount] = useState<string>('02');
    const [scheduleCount, setScheduleLeadCount] = useState<string>('0');
    const [everyCount, setEveryLeadCount] = useState<string>('02');

    const [menuItems, setMenuItems] = useState(getMenuItems(leadCount, scheduleCount, everyCount));

    useEffect(() => {
        setMenuItems(getMenuItems(leadsState, scheduleLeadsState, everyLeadsState ));
    }, [leadsState, scheduleLeadsState,  everyLeadsState]);
    
    return (
        <>
            <UserBox />

            <div id="sidebar-menu">
                <AppMenu menuItems={menuItems} />
            </div>

            <div className="clearfix" />
        </>
    );
};

interface LeftSidebarProps {
    isCondensed: boolean;
}

const LeftSidebar = ({ isCondensed }: LeftSidebarProps) => {
    const menuNodeRef: any = useRef(null);

    /**
     * Handle the click anywhere in doc
     */
    const handleOtherClick = (e: any) => {
        if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
        // else hide the menubar
        if (document.body) {
            document.body.classList.remove('sidebar-enable');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOtherClick, false);

        return () => {
            document.removeEventListener('mousedown', handleOtherClick, false);
        };
    }, []);

    return (
        <React.Fragment>
            <div className="left-side-menu" ref={menuNodeRef}>
                {!isCondensed && (
                    <Scrollbar style={{ maxHeight: '100%' }} timeout={500} scrollbarMaxSize={320}>
                        <SideBarContent />
                    </Scrollbar>
                )}
                {isCondensed && <SideBarContent />}
            </div>
        </React.Fragment>
    );
};

LeftSidebar.defaultProps = {
    isCondensed: false,
};

export default LeftSidebar;
