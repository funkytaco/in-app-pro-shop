import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HollowDotsSpinner, AtomSpinner } from 'react-epic-spinners'
import { Form, FormGroup, FormControl, HelpBlock, ControlLabel, Glyphicon} from 'react-bootstrap';

import { AppWell, AppButton, AppToggleButton, AppToggleButtonGroup } from '../styles';
import { CONTRACTS, CURRENCIES } from "../constants";
import { FlexChild, FlexRow } from "../styles";
import { createNewShop, nameChanged, descChanged, fiatChanged } from "../store/shop/ShopActions";

class SplashView extends Component {

    renderSplashContent = () => {
        return <FlexChild>
            <h1>Digital Goods for Your Dapp Made Easy</h1>

            <h3>
                Add in-app purchases without having to build a system from scratch.
            </h3>

            <ul>
                <li>Quickly create a Shop, defining and categorizing the products you will sell.</li>

                <li>Interact with the In-App Pro Shop smart contracts to allow users to purchase Items.</li>

                <li>Set prices in a stable fiat currency, get paid in Ether.</li>

            </ul>

            <p>
                Items are minted as <a href="http://erc721.org/" rel="noopener noreferrer" target="_blank">ERC-721 non-fungible tokens</a>, which users can trade, sell, or rent on the open market.
            </p>

            <p>
                Building your Shop is free, except for the gas price associated with each blockchain transaction.
            </p>

            <p>
                A small percentage (3%) of each sale goes to the franchise owner (<a href="http://futurescale.com" rel="noopener noreferrer" target="_blank">Futurescale, Inc.</a>),
                and the rest is immediately available for withdrawal by the Shop Owner.
            </p>
        </FlexChild>;
    };

    renderNoAccountContent = () => {
        const {initialized} = this.props;
        return <FlexChild>
            {initialized
                ? <AppWell>
                    <h2>Connect an Ethereum Account</h2>
                    <p>In order to use this Dapp, you must use a browser plugin (e.g., Metamask) or an Ethereum-aware browser (e.g., Trust)</p>
                    <p>You'll need to configure your plugin or browser with one or more accounts that you'll use to maintain Shops, withdraw balances, and make test purchases.</p>
                    </AppWell>
                : <AppWell>
                    <h2>Connecting&nbsp;Ethereum</h2>
                    <AtomSpinner color='red'/>
                  </AppWell>
            }
        </FlexChild>;
    };

    renderNewShopForm = () => {

        const {
            drizzle,
            selectedAccount,
            name,
            description,
            fiat,
            createNewShop,
            nameChanged,
            descChanged,
            fiatChanged,
            creatingShop
        } = this.props;

        const SUCCESS = 'success';
        const ERROR = 'error';

        const handleSubmit = () => {
            createNewShop(drizzle.contracts[CONTRACTS.STOCK_ROOM], selectedAccount, name, description, fiat);
        };

        const getNameValidationState = () => {
            return (name.length === 0) ? null : (name.length > 5) ? SUCCESS : ERROR;
        };

        const getDescValidationState = () => {
            return (description.length === 0) ? null : (description.length > 10) ? SUCCESS : ERROR;
        };

        const isSubmitDisabled = () => {
            return (
                getNameValidationState() !== SUCCESS ||
                getDescValidationState() !== SUCCESS
            );
        };

        const handleNameChange = e => {
            nameChanged(e.target.value);
        };

        const handleDescChange = e => {
            descChanged(e.target.value);
        };

        const handleFiatChange = selection => {
            fiatChanged(selection);
        };

        return <FlexChild><AppWell><Form>
            <h2>Create&nbsp;a&nbsp;New&nbsp;Shop</h2>
            <FormGroup
                controlId='nameField'
                validationState={getNameValidationState()}>
                <FormControl
                    disabled={creatingShop}
                    type="text"
                    bsSize='large'
                    placeholder="Shop Name"
                    onChange={handleNameChange}
                />
                <FormControl.Feedback />
                {(getNameValidationState() === ERROR)
                    ? <HelpBlock>Enter at least 5 characters</HelpBlock>
                    : null}
            </FormGroup>
            <FormGroup
                controlId='descField'
                validationState={getDescValidationState()}>
                <FormControl
                    disabled={creatingShop}
                    componentClass="textarea"
                    bsSize='large'
                    placeholder="Description"
                    onChange={handleDescChange}
                />
                <FormControl.Feedback />
                {(getDescValidationState() === ERROR)
                    ? <HelpBlock>Enter at least 10 characters</HelpBlock>
                    : null}
            </FormGroup>

            <FormGroup>
                <ControlLabel>Fiat Currency for Prices</ControlLabel>
                <br/>
                <AppToggleButtonGroup
                    type="radio"
                    name="shopCurrency"
                    onChange={handleFiatChange}
                    value={fiat}>
                    {Object.values(CURRENCIES).map(sym => <AppToggleButton key={sym.symbol} value={sym.symbol}><Glyphicon glyph={sym.icon} /> - {sym.symbol}</AppToggleButton>)}
                </AppToggleButtonGroup>
            </FormGroup>
            {creatingShop
                ? <HollowDotsSpinner color='black'/>
                : <AppButton
                    bsSize='large'
                    disabled={isSubmitDisabled()}
                    onClick={handleSubmit}>Create</AppButton>}

        </Form></AppWell></FlexChild>;
    };

    render() {

        const {selectedAccount} = this.props;

        return  <FlexRow>
            {this.renderSplashContent()}
            {!selectedAccount
                ? this.renderNoAccountContent()
                : this.renderNewShopForm()
            }
        </FlexRow>
    }
}

const mapStateToProps = (state) => ({
    accounts: state.accountState.accounts,
    selectedAccount: state.accountState.selectedAccount,
    name: state.shopState.newShop.name,
    description: state.shopState.newShop.description,
    fiat: state.shopState.newShop.fiat,
    creatingShop: state.shopState.creatingShop
});

const mapDispatchToProps = (dispatch) => ({
    createNewShop: (contract, owner, name, description, fiat) => dispatch(createNewShop(contract, owner, name, description, fiat)),
    nameChanged: name => {dispatch(nameChanged(name))},
    descChanged: description => {dispatch(descChanged(description))},
    fiatChanged: fiat => {dispatch(fiatChanged(fiat))},
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashView);