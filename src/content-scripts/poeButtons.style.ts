import { css } from 'lit';
export const poeButtonStyles = css`
	.btn {
		display: inline-block;
		margin-bottom: 0;
		font-weight: normal;
		text-align: center;
		vertical-align: middle;
		touch-action: manipulation;
		cursor: pointer;
		background-image: none;
		border: 1px solid #000;
		white-space: nowrap;
		padding: 6px 12px;
		font-size: 13px;
		line-height: 1.45;
		border-radius: 0px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.btn-default {
		color: #ddd;
		background-color: #222;
		border-color: #444;
	}

	.btn-xs,
	.results .row .details .btns .btn,
	.results #trade .search-bar .details .btns .btn,
	#trade .results .search-bar .details .btns .btn {
		padding: 1px 5px;
		font-size: 12px;
		line-height: 1.5;
		border-radius: 0px;
	}

	.btn-default:focus,
	.btn-default.focus {
		color: #ddd;
		background-color: #090909;
		border-color: #040404;
	}

	.btn-default:hover {
		color: #ddd;
		background-color: #090909;
		border-color: #252525;
	}

	.btn-default:active,
	.btn-default.active,
	.open > .btn-default.dropdown-toggle {
		color: #ddd;
		background-color: #090909;
		border-color: #252525;
	}

	.btn-default:active:hover,
	.btn-default:active:focus,
	.btn-default:active.focus,
	.btn-default.active:hover,
	.btn-default.active:focus,
	.btn-default.active.focus,
	.open > .btn-default.dropdown-toggle:hover,
	.open > .btn-default.dropdown-toggle:focus,
	.open > .btn-default.dropdown-toggle.focus {
		color: #ddd;
		background-color: #000;
		border-color: #040404;
	}

	.btn-default:active,
	.btn-default.active,
	.open > .btn-default.dropdown-toggle {
		background-image: none;
	}

	.btn-default.disabled:hover,
	.btn-default.disabled:focus,
	.btn-default.disabled.focus,
	.btn-default[disabled]:hover,
	.btn-default[disabled]:focus,
	.btn-default[disabled].focus,
	fieldset[disabled] .btn-default:hover,
	fieldset[disabled] .btn-default:focus,
	fieldset[disabled] .btn-default.focus {
		background-color: #222;
		border-color: #444;
	}
`;
