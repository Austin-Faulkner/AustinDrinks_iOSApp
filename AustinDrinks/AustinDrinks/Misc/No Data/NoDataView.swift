//
//  NoDataView.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 1/28/22.
//

import UIKit

// Presents a screen alternative to DrinkingEstablishmentCell when one is not found for some
// lack of data from the JSON data requested
class NoDataView: UIView {

    
    var view: UIView!
    
    @IBOutlet var titleLabel: UILabel!
    @IBOutlet var descLabel: UILabel!
    @IBOutlet var accommLabel: UILabel!
    @IBOutlet var ratingLabel:UILabel!
    @IBOutlet var countLabel: UILabel!
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupView()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupView()
    }
    
    func loadViewFromNib() -> UIView {
        let nib = UINib(nibName: "NoDataView", bundle: Bundle.main)
        let view = nib.instantiate(withOwner: self, options: nil) [0] as! UIView
        return view
    }
    
    func setupView() {
        view = loadViewFromNib()
        view.frame = bounds
        view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        addSubview(view)
    }
                                                          
    func set(title: String, desc: String, accomm: String, rating: String, count: String) {
        titleLabel.text = title //.description
        descLabel.text = desc //.description
        accommLabel.text = accomm //.description
        ratingLabel.text = rating //.description
        countLabel.text = count //.description
    }
}
