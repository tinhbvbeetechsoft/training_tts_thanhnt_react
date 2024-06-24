import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { connect } from 'react-redux';
import { IRootState } from 'src/Services/Reducers';
import { MenuItem } from 'primereact/menuitem';
import { menu } from 'src/Config/menu';
import { setCollapsed } from 'src/Services/Reducers/authentication';
import AppSubMenu from './AppSubMenu';

import _ from 'lodash';
type IAppMenuProps = StateProps & DispatchProps & {
}
const AppMenu = (props: IAppMenuProps) => {
    const [isShowSearch, setIsShowSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [value, setValue] = useState('');
    const navSearchText = useRef<any>(null);
    const location = useLocation();
    const [memoizedValue, setMemoizedValue] = useState(menu as any);
    // *********************
    const [menuMode, setMenuMode] = useState('sidebar');
    const [menuActive, setMenuActive] = useState(false);
    const [resetActiveIndex, setResetActiveIndex] = useState<any>(null);

    const computedExpanded = (items: MenuItem[], pathname: string) => {
        if (!items) {
            return;
        }
        items.forEach((child: any) => {
            if (pathname.includes(child.value)) {
                child.expanded = true;
                computedExpanded(child.items, pathname);
            }
            if (pathname == child.to) {
                child.className += ' parent-menu-active';
            }
        });
    };
    const toggleClass = (isShowSearchBox: any) => {
        setIsShowSearch(isShowSearchBox)
        if (isShowSearchBox) {
            setTimeout( () => {
                navSearchText.current?.focus();
            }, 500);
        } else {
            setValue('');
        }
    };
    const onChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    }
    useEffect(() => {
        onNavSearch()
    }, [value]);
    const onNavSearch = () => {
        clearHighlight();
        if (value == '') {
            findMenu(null);
            setIsSearching(false)
          } else {
            findMenu(value.trim().toLowerCase());
            setIsSearching(true)
          }
    }
    const highlight = (text :any) => {
        const nav = document.getElementById('nav-container');
        const menuItems = nav?.getElementsByClassName('p-menuitem-text');
        clearHighlight();
        Array.prototype.forEach.call(menuItems, function(el) {
        let innerHTML = el.innerHTML;
        innerHTML = innerHTML.replace(new RegExp(text , 'gi'),  '<b style="background-color:#ff0;font-size:100%;color:#D03D03">$&</b>');
        el.innerHTML = innerHTML;
        });
    }
    const clearHighlight = () => {
        const nav = document.getElementById('nav-container');
        const menuItems = nav?.getElementsByClassName('p-menuitem-text');
        Array.prototype.forEach.call(menuItems, function(el) {
          let innerHTML = el.innerHTML;
          innerHTML = innerHTML.replace(new RegExp('<b style="background-color:#ff0;font-size:100%;color:#D03D03">', 'gi'), () => {
            return '';
          });
          innerHTML = innerHTML.replace(new RegExp('</b>', 'gi'), () => {
            return '';
          });
          el.innerHTML = innerHTML;
        });
      }
    const findMenu = (keyword :any) => {
        if (keyword === null) {
            deepClearStyle(memoizedValue);
            clearHighlight();
            setMemoizedValue(_.cloneDeep(memoizedValue));
            return;
        }
        deepApplyStyle(memoizedValue, keyword);
        setTimeout(() => {
            highlight(keyword);
        }, 200);
        setMemoizedValue(_.cloneDeep(memoizedValue));
    }
    const deepClearStyle = (items: any) => {
        for (const item of items) {
            item.className = '';
            if (item.items && item.items.length > 0) {
              deepClearStyle(item.items);
            }
        }
    }
    const deepApplyStyle = (items: any, keyword: string) => {
        for (const item of items) {
            const className = "";
            let classNameMap = className.split(" ");
            if (isMatched(item, keyword) && classNameMap.indexOf('matched') === -1) {
                const index = item.className.indexOf('parents-matched');
                if (index === -1) {
                    classNameMap.push('matched');
                }
            }
            if (isParentMatched(item, keyword) && classNameMap.indexOf('parents-matched') === -1) {
                const index = classNameMap.indexOf('matched');
                if (index !== -1) {
                    classNameMap.splice(index, 1);
                }
                classNameMap.push('parents-matched');
            }
            item.className = classNameMap.join(" ");
            if (item.items && item.items.length > 0) {
              deepApplyStyle(item.items, keyword);
            }
        }
    }
    const isMatched = (item: any, keyword: string) : boolean => {
        const text = item.label.toLowerCase();
        return text.includes(keyword.toString().toLowerCase());
    }
    const isParentMatched = (item: any, keyword: string) : boolean => {
        if (item.items && item.items.length > 0) {
            for (const child of item.items) {
              if (isMatched(child, keyword) || isParentMatched(child, keyword)) {
                return true;
              }
            }
            return false;
        } else {
            return false;
        }
    }
    useEffect(() => {
        const initMenu = () => {
            const pathname = _.get(location, 'pathname') || '';
            const items = _.cloneDeep(memoizedValue as any)
            computedExpanded(items, pathname);
            setMemoizedValue(items);
        }
        initMenu();
    }, [location]);

    /// ****************************************
    let menuClick;

    const isHorizontal = () => {
        return menuMode === 'horizontal';
    }

    const isSlim = () => {
        return menuMode === 'slim';
    }

    useEffect(() => {
        setResetActiveIndex(true);
        setMenuActive(false)
    }, [menuMode]);

    const onMenuClick = () => {
        menuClick = true;
    }

    const onMenuItemClick = (event: any) => {
        if (!event.item.items) {
            setResetActiveIndex(true);
        }

        if (!event.item.items && (isHorizontal() || isSlim())) {
            setMenuActive(false);
        }
    }

    const onRootMenuItemClick = () => {
        setMenuActive(prevState => !prevState)
    }

    const onToggleMenu = () => {
        const newState = !props.isCollapsed;
        props.setCollapsed(newState);
    }

    return (
        <div className={classNames('layout-menu-wrapper', { 'collapsed': props.isCollapsed, 'openSearchBox': isShowSearch && !props.isCollapsed, 'isSearching': isSearching && !props.isCollapsed })}>
            <div className="menu-logo">
                <div className="d-flex justify-content-between w100">
                    <button name='search-toggle' type='button' className='btn btn-default collapse-header' role='button' onClick={onToggleMenu} >
                        { props.isCollapsed ?<i className="menu-opend"></i> : <i className="menu-opend"></i> }
                        <span>Thu gọn</span>
                    </button>
                    <div className="wrap-logo">
                    </div>
                </div>
            </div>
            <div className="layout-menu-container">
                <div className="search-box">
                    <div className="ui-ribbon-wrapper position-absolute overflow-hidden">
                        <div title="Tìm menu" id="findMenu" onClick={() => toggleClass(true)} className="ui-ribbon">
                            <span className="pi pi-search"></span>
                        </div>
                    </div>
                    <div className="nav-search-wrap" >
                        <div className="nav-search">
                            <form className="position-relative">
                                <input name="search-input" id="navSearchText" placeholder="Search..." ref={navSearchText} autoComplete="off" value={value} className="form-control" onChange={onChange} type="text"/>
                                <span id="navSearchButton" className="position-absolute btn-close" onClick={() => toggleClass(false)}>
                                    <span className="pi pi-times"></span>
                                </span>
                            </form>
                        </div>
                    </div>
                </div>
                <AppSubMenu id="nav-container" items={memoizedValue} className="layout-menu" menuMode={menuMode} menuActive={menuActive} root parentMenuItemActive
                    onMenuClick={onMenuClick} onMenuItemClick={onMenuItemClick} onRootMenuItemClick={onRootMenuItemClick} resetActiveIndex={resetActiveIndex}/>
            </div>
        </div>
    )
}

const mapStateToProps = ({ locale, authenticationState }: IRootState) => ({
    currentLocale: locale.currentLocale,
    isCollapsed: authenticationState.isCollapsed
});

const mapDispatchToProps = {
    setCollapsed
};

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps;
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(AppMenu);
