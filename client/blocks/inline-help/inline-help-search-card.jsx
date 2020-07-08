/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { identity } from 'lodash';
import debugFactory from 'debug';

/**
 * Internal Dependencies
 */
import { recordTracksEvent } from 'state/analytics/actions';
import SearchCard from 'components/search-card';
import getInlineHelpCurrentlySelectedLink from 'state/inline-help/selectors/get-inline-help-currently-selected-link';
import getSelectedResultIndex from 'state/inline-help/selectors/get-selected-result-index';
import isRequestingInlineHelpSearchResultsForQuery from 'state/inline-help/selectors/is-requesting-inline-help-search-results-for-query';
import getInlineHelpCurrentlySelectedResult from 'state/inline-help/selectors/get-inline-help-currently-selected-result';
import {
	setInlineHelpSearchQuery,
	selectNextResult,
	selectPreviousResult,
} from 'state/inline-help/actions';

/**
 * Module variables
 */
const debug = debugFactory( 'calypso:inline-help' );

class InlineHelpSearchCard extends Component {
	static propTypes = {
		onSelect: PropTypes.func,
		translate: PropTypes.func,
		track: PropTypes.func,
		query: PropTypes.string,
		placeholder: PropTypes.string,
		location: PropTypes.string,
		selectedResult: PropTypes.object,
	};

	static defaultProps = {
		translate: identity,
		query: '',
		location: 'inline-help-popover',
		selectedResult: {},
	};

	constructor() {
		super( ...arguments );

		this.searchHelperHandler = this.searchHelperHandler.bind( this );
	}

	searchHelperHandler = ( searchQuery ) => {
		const query = searchQuery.trim();

		if ( query?.length ) {
			debug( 'search query received: ', searchQuery );
			this.props.track( 'calypso_inlinehelp_search', {
				search_query: searchQuery,
				location: this.props.location,
			} );
		}

		// Set the query search
		this.props.setInlineHelpSearchQuery( searchQuery );
	};

	render() {
		return (
			<SearchCard
				searching={ this.props.isSearching }
				initialValue={ this.props.query }
				onSearch={ this.searchHelperHandler }
				placeholder={ this.props.placeholder || this.props.translate( 'Search for help…' ) }
				delaySearch={ true }
			/>
		);
	}
}

const mapStateToProps = ( state, ownProps ) => ( {
	isSearching: isRequestingInlineHelpSearchResultsForQuery( state, ownProps.query ),
	selectedLink: getInlineHelpCurrentlySelectedLink( state ),
	selectedResultIndex: getSelectedResultIndex( state ),
	selectedResult: getInlineHelpCurrentlySelectedResult( state ),
} );
const mapDispatchToProps = {
	track: recordTracksEvent,
	setInlineHelpSearchQuery,
	selectNextResult,
	selectPreviousResult,
};

export default connect( mapStateToProps, mapDispatchToProps )( localize( InlineHelpSearchCard ) );
