struct TokenLocation {
    latitude: Field,
    longitude: Field
}


fn main(latitude: Field, longitude: Field) {
    assert(latitude == 185424);
    assert(longitude == 453);
}

#[test]
fn test_main() {
    main(185424, 453);

    // Uncomment to make test fail
    // main(1, 1); latitude: 185424 longitude: -453
}
