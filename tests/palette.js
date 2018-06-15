const assert = require( "chai" ).assert;
const Color = require( "../src/color.js" );
const Palette = require( "../src/palette.js" );

let createPalette =
{
	fromColors( colors )
	{
		return new Palette( 140, 'My Palette', colors );
	},

	fromId( id )
	{
		return new Palette( id, 'My Palette', [] );
	},

	fromName( name )
	{
		return new Palette( 280, name, [] );
	},

	instance()
	{
		return new Palette( 140, 'My Palette', [] );
	},
};

describe( 'Palette', function()
{
	describe( '.colors', function()
	{
		it( 'are set by constructor', function()
		{
			let colors = [
				new Color( 1, 0.23, 0.45 ),
			];
			let palette = createPalette.fromColors( colors );

			assert.equal( 1, palette.colors.length );

			assert.equal( colors[0].h, palette.colors[0].h );
			assert.equal( colors[0].s, palette.colors[0].s );
			assert.equal( colors[0].l, palette.colors[0].l );
		});

		it( 'are assigned an index by constructor', function()
		{
			let colors = [
				new Color( 1, 0.23, 0.45 ),
			];
			colors.forEach( color =>
			{
				assert.isNull( color.index );
			});

			let palette = createPalette.fromColors( colors );
			palette.colors.forEach( (color, index) =>
			{
				assert.equal( index, color.index );
			});
		});
	});

	describe( '.callWizard', function()
	{
		it( 'passes colors and index of changed color to wizard', function()
		{
			let colorsCanary, indexCanary;

			let colors = [
				new Color( 1, 0.23, 0.45 ),
				new Color( 2, 0.34, 0.56 ),
			];

			let palette = createPalette.fromColors( colors );
			palette.wizard = function( colors, index )
			{
				colorsCanary = colors;
				indexCanary = index;
			};

			assert.isUndefined( colorsCanary );
			assert.isUndefined( indexCanary );

			let index = 0;
			palette.callWizard( index );

			assert.equal( palette.colors, colorsCanary );
			assert.equal( index, indexCanary );
		});

		it( 'is called when color value is changed', function()
		{
			let colors = [
				new Color( 1, 0.23, 0.45 ),
				new Color( 2, 0.34, 0.56 ),
			];

			let palette = createPalette.fromColors( colors );

			let wizardCanary = 0;
			palette.wizard = function( colors, index )
			{
				wizardCanary++;
			};

			palette.colors[0].h = 2;
			assert.equal( 1, wizardCanary );

			palette.colors[1].s = 0.5;
			assert.equal( 2, wizardCanary );
		});

		it( 'sets shouldEmit to false on all for duration of wizard', function()
		{
			let colors = [
				new Color( 1, 0.23, 0.45 ),
				new Color( 2, 0.34, 0.56 ),
			];

			let palette = createPalette.fromColors( colors );

			let didRunWizard = false;
			let shouldEmitCanary = false;
			palette.wizard = function( colors, index )
			{
				didRunWizard = true;

				colors.forEach( color =>
				{
					shouldEmitCanary = shouldEmitCanary || color.shouldEmit;
				});
			};

			palette.colors[1].h = 100;

			assert.isTrue( didRunWizard, 'did run wizard' );
			assert.isFalse( shouldEmitCanary, 'disabled shouldEmit for all colors' );

			palette.colors.forEach( color =>
			{
				assert.isTrue( color.shouldEmit, 're-enabled shouldEmit for all colors' );
			});
		});

		it( 'sets isEditable to false on updated color for duration of wizard', function()
		{
			let colors = [
				new Color( 1, 0.23, 0.45 ),
				new Color( 2, 0.34, 0.56 ),
			];

			let palette = createPalette.fromColors( colors );

			let indexCanary, isEditableCanary;
			palette.wizard = function( colors, index )
			{
				indexCanary = index;
				isEditableCanary = colors[index].isEditable;
			};

			let updatedIndex = 1;
			palette.colors[updatedIndex].h = 100;

			assert.equal( updatedIndex, indexCanary );
			assert.isFalse( isEditableCanary );
			assert.isTrue( palette.colors[updatedIndex].isEditable );
		});

		it( 'does not address non-existent `colors` index', function()
		{
			let palette = createPalette.fromColors([
				new Color( 1, 0.23, 0.45 ),
			]);

			palette.wizard = function( colors )
			{
				colors[0].h = 300;
				colors[0].s = 0;
				colors[0].l = 1;
			};

			palette.callWizard( -1 );

			assert.equal( 300, palette.colors[0].h );
			assert.equal(   0, palette.colors[0].s );
			assert.equal(   1, palette.colors[0].l );
		});
	});

	describe( '.enabled', function()
	{
		it( 'is true by default', function()
		{
			let palette = createPalette.instance();
			assert.isTrue( palette.enabled );
		});
	});

	describe( '.id', function()
	{
		it( 'is set by constructor', function()
		{
			let id = 140;
			let palette = createPalette.fromId( id );

			assert.equal( id, palette.id );
		});
	});

	describe( '.name', function()
	{
		it( 'is set by constructor', function()
		{
			let name = 'My Palette ✌️';
			let palette = createPalette.fromName( name );

			assert.equal( name, palette.name );
		});
	});
});
