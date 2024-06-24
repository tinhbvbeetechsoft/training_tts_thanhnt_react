import { NavLink, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { IRootState } from 'src/Services/Reducers';
import { useCallback, useEffect, useState } from 'react';
import { MenuItem } from 'primereact/menuitem';
import { Ripple } from 'primereact/ripple';
import { CSSTransition } from 'primereact/csstransition';
import classNames from 'classnames';
import { Badge } from 'primereact/badge';
type IAppSubMenuProps = StateProps & DispatchProps & {
    items: MenuItem[],
    id?: string;
    className?: string;
    root?: boolean;
    menuMode?: any;
    menuActive?: any;
    parentMenuItemActive?: any;
    resetActiveIndex?: any;
    onRootMenuItemClick?: Function;
    onMenuItemClick?: Function;
    onMenuClick?: Function;
}
const AppSubMenu = (props: IAppSubMenuProps) => {
    const history = useHistory();
    const [activeIndex, setActiveIndex] = useState<Number | undefined>(undefined);
    const onMenuItemClick = (event: any, item: MenuItem, index: number) => {
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
            event.preventDefault();
        }

        if (item.items) {
            event.preventDefault();
        }

        if (props.root) {
            props.onRootMenuItemClick && props.onRootMenuItemClick({ originalEvent: event });
        }

        if (item.items) {
            setActiveIndex(index === activeIndex ? undefined : index);
        }

        else {
            if (props.menuMode !== 'sidebar') {
                const ink = getInk(event.currentTarget);
                if (ink) {
                    removeClass(ink, 'p-ink-active');
                }
            }
        }

        props.onMenuItemClick && props.onMenuItemClick({ originalEvent: event, item: item });
    };

    const onKeyDown = (event: any, item: MenuItem, index: number) => {
        if (event.key === 'Enter') {
            onMenuItemClick(event, item, index);
        }
    }

    const getInk = (el: Element) => {
        for (let i = 0; i < el.children.length; i++) {
            if (typeof el.children[i].className === 'string' && el.children[i].className.indexOf('p-ink') !== -1) {
                return el.children[i];
            }
        }
        return null;
    };

    const removeClass = (element: Element, className: string) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };

    const onMenuItemMouseEnter = (index: number) => {
        if (props.root && props.menuActive && isHorizontalOrSlim() && !isMobile()) {
            setActiveIndex(index);
        }
    };

    const isMobile = () => {
        return window.innerWidth <= 991;
    }
    const isStatic = () => {
        return props.menuMode === 'static';
    }

    const isHorizontalOrSlim = useCallback(() => {
        return (props.menuMode === 'horizontal' || props.menuMode === 'slim');
    }, [props.menuMode]);


    const visible = (item: any) => {
        return typeof item.visible === "function" ? item.visible() : item.visible !== false;
    };

    const getLink = (item: any, index: number) => {
        const menuitemIconClassName = classNames('layout-menuitem-icon', item.icon);
        const content = (
            <>
                <i className={menuitemIconClassName}></i>
                <span className="layout-menuitem-text">{item.label}</span>
                {item.items && <i className="pi pi-fw pi-chevron-down  layout-submenu-toggler"></i>}
                {item.badge && <Badge value={item.badge} severity="success"/>}
                <Ripple />
            </>
        );
        const commonLinkProps = {
            'style': item.style,
            'className': classNames('p-ripple', { 'p-disabled': item.disabled }),
            'target': item.target,
            'onClick': (e: any) => onMenuItemClick(e, item, index),
            'onMouseEnter': () => onMenuItemMouseEnter(index),
            'onKeyDown': (e: any) => onKeyDown(e, item, index)
        }

        if (item.to) {
            return <NavLink to={item.to} exact activeClassName="active-route" {...commonLinkProps}>{content}</NavLink>;
        } else if (item.url) {
            return <a href={item.url} rel="noopener noreferrer" tabIndex={item.url ? undefined : 0} {...commonLinkProps}>{content}</a>
        }
        else {
            return <a rel="noopener noreferrer" tabIndex={item.url ? undefined : 0} {...commonLinkProps}>{content}</a>
        }
    };

    const getItems = () => {
        const transitionTimeout = isHorizontalOrSlim() && !props.root ? { enter: 1000, exit: 450 } : (isHorizontalOrSlim() && !isMobile() ? 0 : { enter: 1000, exit: 450 });
        return props.items.map((item, i) => {
            if (visible(item)) {
                const active = activeIndex === i;
                const menuitemClassName = classNames(item.className,{ 'layout-root-menuitem': props.root, 'active-menuitem': active && !item.disabled });
                const link = getLink(item, i);
                return (
                    <li key={item.label || i} className={menuitemClassName} role="menuitem">
                        {props.root && isStatic() && <div className="layout-menuitem-text">{item.label}</div>}
                        {link}
                        <CSSTransition classNames="p-toggleable-content" timeout={transitionTimeout} in={item.items && props.root && isStatic() ? true : active} unmountOnExit>
                            <AppSubMenu items={visible(item) && item.items} menuActive={props.menuActive} menuMode={props.menuMode}
                            parentMenuItemActive={active} onMenuItemClick={props.onMenuItemClick} currentLocale={props.currentLocale} isCollapsed={props.isCollapsed}></AppSubMenu>
                        </CSSTransition>
                    </li>
                );
            }
            return null;
        })
    };

    useEffect(() => {
        if (props.resetActiveIndex && isHorizontalOrSlim()) {
            setActiveIndex(undefined);
        }
    }, [props.resetActiveIndex, isHorizontalOrSlim]);

    useEffect(() => {
        if (!props.menuActive && isHorizontalOrSlim() && !isMobile()) {
            setActiveIndex(undefined);
        }
    }, [props.menuActive, isHorizontalOrSlim]);

    if (!props.items) {
        return null;
    }

    const items = getItems();
    return (
        <ul id={props.id} className={props.className} role="menu">
            {items}
        </ul>
    );
}

const mapStateToProps = ({ locale, authenticationState }: IRootState) => ({
    currentLocale: locale.currentLocale,
    isCollapsed: authenticationState.isCollapsed
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps;
export default connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore
)(AppSubMenu);
