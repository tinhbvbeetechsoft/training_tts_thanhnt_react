/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { css } from '@emotion/react';
import { useState , useRef, useEffect } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { useLocation } from 'react-router';
import _ from 'lodash';
import { MenuItem } from 'primereact/menuitem';
import { menu } from 'src/Config/menu';
import { IRootState } from 'src/Services/Reducers';

type ISidebarMenuLeftProps = StateProps & DispatchProps & {
}
const appSidebarLeft = css`
.ui-ribbon-danger {
    z-index: 3;
}
.ui-ribbon-wrapper {
    height: 52px;
    width: 52px;
    opacity: 0.85;
    right: -2px;
    top: -1px
}
.ui-ribbon {
    padding: 2px 0px;
    top: 6px;
    left: -5px;
    width: 77px;
    cursor: pointer;
    background-color: #dc2110;
    position: relative;
    color: #fff;
    transform: rotate(45deg);
    line-height: 20px;
    box-shadow: 0 0 3px rgb(0 0 0 / 30%);
}
.pi-search {
    transform: rotate(-45deg);
    top: 0px;
    left: 30px;
    font-size: 14px;
    position: relative;
}
.nav-search-wrap {
    position: absolute;
    // min-width: 200px;
    width: var(--side-bar-left-width);
    left: 250px;
    transition: all 0.25s ease-out 0.25s;
    z-index: 2;
}
.side-bar-left {
    overflow: hidden;
}
.openSearchBox .nav-search-wrap {
    left: 0;
}
.side-bar-left.isSearching .p-panelmenu-panel.matched,
.side-bar-left.isSearching .p-panelmenu-panel.parents-matched
 {
    display: block;
}
.nav-search {
    padding: 7px 44px 7px 7px;
}
.main-menu {
    transition: all 0.25s ease-out 0.5s;
}
.openSearchBox .main-menu {
    padding-top: 52px;
    transition: all 0.25s ease-out 0.25s;
}
 .btn-close {
    background-color: transparent;
    border: none;
    outline: none;
    top: 3px;
    right: 1px;
}
.side-bar-left.isSearching .p-panelmenu-panel{
    display: none;
}
.side-bar-left .btn-close .pi {
    font-size: 14px;
}
`
const SidebarMenuLeft = (props: ISidebarMenuLeftProps) => {
    const [isShowSearch, setIsShowSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [value, setValue] = useState('');
    const navSearchText = useRef<any>(null);
    const location = useLocation();
    const [memoizedValue, setMemoizedValue] = useState(menu as any);

    const computedExpanded = (items: MenuItem[], pathname: string) => {
        if (!items) {
            return;
        }
        items.forEach((child: any) => {
            if (pathname.includes(child.value)) {
                child.expanded = true;
                computedExpanded(child.items, pathname);
            }
            if (pathname == child.url) {
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
    const onChange = (e : any) => {
        setValue(e?.target?.value);
    }

    useEffect(() => {
        onNavSearch()
    }, [value])
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
    }, [location])
    return (
        <div css={appSidebarLeft}>
            <div  className={`${isShowSearch ? "openSearchBox" : ""} ${isSearching ? "isSearching" : ""} side-bar-left`}>
                    <div className="position-relative ui-ribbon-danger">
                        <div className="ui-ribbon-wrapper position-absolute overflow-hidden">
                            <div title="Tìm menu" id="findMenu" onClick={() => toggleClass(true)} className="ui-ribbon">
                                <span className="pi pi-search"></span>
                            </div>
                        </div>
                    </div>
                    <div className="nav-search-wrap" >
                        <div className="nav-search">
                        <form className="position-relative">
                            <input id="navSearchText" ref={navSearchText} placeholder="Tìm..." autoComplete="off" value={value} className="form-control" onChange={onChange} type="text"/>
                            <button type="button" id="navSearchButton" className="position-absolute btn-close" onClick={() => toggleClass(false)}><span className="pi pi-times"></span></button>
                        </form>
                        </div>
                </div>
                <PanelMenu model={memoizedValue} id="nav-container" className='main-menu' />
            </div>
        </div>
    );
};


const mapStateToProps = ({ }: IRootState) => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SidebarMenuLeft);

