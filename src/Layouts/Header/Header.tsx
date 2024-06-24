/** @jsxImportSource @emotion/react */
import { useRef } from 'react';
import { connect } from 'react-redux';
import { Avatar } from 'primereact/avatar';
import { TieredMenu } from 'primereact/tieredmenu';
import { css } from '@emotion/react';
import { IRootState } from 'src/Services/Reducers';
import { setCollapsed } from 'src/Services/Reducers/authentication';

const appHeaderCss = css`
.header-branch {
    width: var(--side-bar-left-width);
    background-color: var(--color-main);
    color: white;
}
.img-logo, .header-avatar {
    width: 60px;
}
.header-search-wrap {
    display: inline-block;
}
.main-rotate {
    height: 73px;
    transform: rotate(27deg);
    width: 28px;
    right: -18px;
    top: -15px;
    background-color: var(--color-main);
}
.main-style {
    width: 100px;
}
.img-communism {
    height: 30px;
    margin-left: 15px;
}
.collapse-header {
    width: var(--header-height);
}
.collapse-header .pi{
    font-size: 20px;
    color: white;
}

`;

type IHeaderProps = StateProps & DispatchProps & {
}

const Header = (props: IHeaderProps) => {
    const refMenu = useRef<any>(null);

    const items = [
        {
            label: 'ahihi',
            disabled: true
        },
        {
            separator: true
        },
        {
            label: 'Đăng xuất',
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                window.location.href = '/account/login';
            }
        }
    ];

    return (
        <div className="app-header display-table w100" css={appHeaderCss}>
            <div className="account-info display-table-cell">
                <div className="display-table w100 h100">
                    <div className="display-table-cell text-center">
                        <div className='header-search-wrap'>
                        </div>
                    </div>
                    <div className="header-avatar display-table-cell text-center">
                        <Avatar
                            label={'#'}
                            size="large"
                            className='border-main'
                            shape="circle"
                            onClick={(e) => refMenu?.current && refMenu.current.toggle(e)} />
                        <TieredMenu model={items} popup ref={refMenu} />
                    </div>
                </div>
            </div>
        </div>
    );
};


const mapStateToProps = ({authenticationState: {isCollapsed}}: IRootState) => ({
    isCollapsed
});

const mapDispatchToProps = {
    setCollapsed: setCollapsed
};

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);

