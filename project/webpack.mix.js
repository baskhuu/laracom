let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Bootstrap 3.3.7 + AdminLTE 2.x + jQuery 2.2.3 構成
 |
 | ビルド順序:
 |   1. Sass コンパイル (admin.scss / front.scss) → public/css/admin-theme.css, front-theme.css
 |   2. CSS 結合 (vendor CSS + Sass出力) → public/css/admin.min.css, style.min.css
 |   3. JS 結合 (jQuery先頭) → public/js/admin.min.js, front.min.js
 |
 */

mix
    // =========================================================
    // Admin CSS
    // Sass を先にコンパイルして、styles() で vendor と結合する
    // =========================================================
    .sass('resources/assets/sass/admin.scss', 'public/css/admin-theme.css')
    .styles(
        [
            'node_modules/bootstrap/dist/css/bootstrap.css',           // Bootstrap 3.3.7
            'node_modules/font-awesome/css/font-awesome.css',
            'node_modules/ionicons/dist/css/ionicons.css',
            'node_modules/select2/dist/css/select2.css',
            'resources/assets/admin-lte/css/AdminLTE.min.css',
            'resources/assets/admin-lte/css/skins/skin-purple.min.css',
            'node_modules/datatables/media/css/jquery.dataTables.css',
            'node_modules/trix/dist/trix.css',                          // Trix エディタ
            'public/css/admin-theme.css',                               // Sass コンパイル済み
        ],
        'public/css/admin.min.css'
    )

    // =========================================================
    // Admin JS
    // jQuery を必ず先頭に配置（AdminLTE 2.x / Bootstrap 3 が jQuery 必須）
    // =========================================================
    .scripts(
        [
            'resources/assets/js/jquery-2.2.3.min.js',                 // ① jQuery 2.2.3
            'node_modules/bootstrap/dist/js/bootstrap.js',              // ② Bootstrap 3 JS
            'node_modules/select2/dist/js/select2.js',                  // ③ Select2
            'node_modules/datatables/media/js/jquery.dataTables.js',    // ④ DataTables
            'resources/assets/admin-lte/js/app.js',                     // ⑤ AdminLTE 2.x
            'node_modules/trix/dist/trix.umd.js',                       // ⑥ Trix エディタ
        ],
        'public/js/admin.min.js'
    )

    // =========================================================
    // Front CSS
    // =========================================================
    .sass('resources/assets/sass/front.scss', 'public/css/front-theme.css')
    .styles(
        [
            'node_modules/bootstrap/dist/css/bootstrap.css',            // Bootstrap 3.3.7
            'node_modules/font-awesome/css/font-awesome.css',
            'node_modules/select2/dist/css/select2.css',
            'node_modules/owl.carousel/dist/assets/owl.carousel.css',
            'node_modules/owl.carousel/dist/assets/owl.theme.default.css',
            'resources/assets/css/drift-basic.min.css',
            'resources/assets/css/front.css',
            'public/css/front-theme.css',                               // Sass コンパイル済み
        ],
        'public/css/style.min.css'
    )

    // =========================================================
    // Front JS
    // jQuery を必ず先頭に配置（Bootstrap 3 JS / owl.carousel が jQuery 必須）
    // =========================================================
    .scripts(
        [
            'resources/assets/js/jquery-2.2.3.min.js',                 // ① jQuery 2.2.3
            'node_modules/bootstrap/dist/js/bootstrap.js',              // ② Bootstrap 3 JS
            'node_modules/select2/dist/js/select2.js',                  // ③ Select2
            'resources/assets/js/owl.carousel.min.js',                  // ④ owl.carousel
            'resources/assets/js/Drift.min.js',                         // ⑤ Drift
        ],
        'public/js/front.min.js'
    )

    // =========================================================
    // アセットコピー
    // =========================================================
    .copyDirectory('node_modules/datatables/media/images', 'public/images')
    .copyDirectory('node_modules/font-awesome/fonts', 'public/fonts')
    .copyDirectory('node_modules/ionicons/dist/fonts', 'public/fonts')
    .copyDirectory('resources/assets/admin-lte/img', 'public/img')
    .copyDirectory('resources/assets/images', 'public/images')
    .copy('resources/assets/js/scripts.js', 'public/js/scripts.js')
    .copy('resources/assets/js/custom.js', 'public/js/custom.js');

/*
|-----------------------------------------------------------------------
| BrowserSync
|-----------------------------------------------------------------------
*/
mix.browserSync({
    proxy: 'http://localhost:8000',
    host: 'localhost',
    open: true,
    watchOptions: {
        usePolling: false
    },
    files: [
        'app/**/*.php',
        'resources/views/**/*.php',
        'public/js/**/*.js',
        'public/css/**/*.css',
    ]
});
