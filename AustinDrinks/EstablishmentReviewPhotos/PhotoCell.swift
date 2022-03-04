//
//  PhotoCell.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/3/22.
//

import UIKit

class PhotoCell: UICollectionViewCell {
    @IBOutlet var imageReview: UIImageView!
}

extension PhotoCell {
    func set(image: UIImage) {
        imageReview.image = image
    }
    override func awakeFromNib() {
        super.awakeFromNib()
        imageReview.layer.cornerRadius = 9
        imageReview.layer.masksToBounds = true
    }
}


