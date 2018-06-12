const assert = require( "chai" ).assert;
const Color = require( "../src/color.js" );
const Palette = require( "../src/palette.js" );

describe( 'Palette', function()
{
	describe( '.colors', function()
	{
		it( 'are set by constructor', function()
		{
			let colors = [
				new Color( 1, 0.23, 0.45 ),
			];
			let palette = new Palette( colors );

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

			let palette = new Palette( colors );
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

			let palette = new Palette( colors );
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

			let palette = new Palette( colors );

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

			let palette = new Palette( colors );

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

			let palette = new Palette( colors );

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
	});
});
