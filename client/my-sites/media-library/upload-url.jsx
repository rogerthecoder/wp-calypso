/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import classNames from 'classnames';
import Gridicon from 'components/gridicon';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { bumpStat } from 'lib/analytics/mc';
import FormTextInput from 'components/forms/form-text-input';
import { ScreenReaderText } from '@automattic/components';
import MediaActions from 'lib/media/actions';
import { clearMediaItemErrors } from 'state/media/actions';

/**
 * Style dependencies
 */
import './upload-url.scss';

class MediaLibraryUploadUrl extends Component {
	static propTypes = {
		className: PropTypes.string,
		site: PropTypes.object,
		onAddMedia: PropTypes.func,
		onClose: PropTypes.func,
	};

	static defaultProps = {
		onAddMedia: noop,
		onClose: noop,
	};

	state = {
		value: '',
		isError: false,
	};

	upload = ( event ) => {
		event.preventDefault();

		const isError = ! event.target.checkValidity();
		this.setState( { isError } );

		if ( isError || ! this.props.site ) {
			return;
		}

		this.props.clearMediaItemErrors( this.props.site.ID );
		MediaActions.add( this.props.site, this.state.value );

		this.setState( { value: '', isError: false } );
		this.props.onAddMedia();
		this.props.onClose();
		bumpStat( 'editor_upload_via', 'url' );
	};

	onChange = ( event ) => {
		this.setState( {
			isError: false,
			value: event.target.value,
		} );
	};

	onKeyDown = ( event ) => {
		if ( event.key === 'Escape' ) {
			return this.props.onClose( event );
		}

		if ( event.key !== 'Enter' ) {
			return;
		}

		this.upload( event );
	};

	render() {
		const classes = classNames( 'media-library__upload-url', this.props.className );
		const { onClose, translate } = this.props;

		return (
			<form className={ classes } onSubmit={ this.upload } noValidate>
				<FormTextInput
					type="url"
					value={ this.state.value }
					placeholder="https://"
					onChange={ this.onChange }
					onKeyDown={ this.onKeyDown }
					isError={ this.state.isError }
					// eslint-disable-next-line jsx-a11y/no-autofocus
					autoFocus
					required
				/>

				<div className="media-library__upload-url-button-group">
					{ /* eslint-disable-next-line wpcalypso/jsx-classname-namespace */ }
					<button type="submit" className="button is-primary">
						{ translate( 'Upload', { context: 'verb' } ) }
					</button>

					<button type="button" className="media-library__upload-url-cancel" onClick={ onClose }>
						<ScreenReaderText>{ translate( 'Cancel' ) }</ScreenReaderText>
						<Gridicon icon="cross" />
					</button>
				</div>
			</form>
		);
	}
}

export default connect( null, { clearMediaItemErrors } )( localize( MediaLibraryUploadUrl ) );
